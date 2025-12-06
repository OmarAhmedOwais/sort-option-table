import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { of, switchMap, catchError, map, startWith, debounceTime, distinctUntilChanged } from 'rxjs';
import { Product, ProductsQueryParams } from '../../models/product.model';
import { DataTableComponent, SearchInputComponent, TableColumn, SortEvent } from '../../../../shared';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalRecords: number;
  page: number;
  rows: number;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [CommonModule, DataTableComponent, SearchInputComponent],
  templateUrl: './products-table.component.html',
})
export class ProductsTableComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly columns: TableColumn[] = [
    { field: 'id', header: 'ID', sortable: true, width: '8%' },
    { field: 'title', header: 'Title', sortable: true, width: '25%' },
    { field: 'price', header: 'Price', sortable: true, width: '12%', type: 'currency' },
    { field: 'category', header: 'Category', sortable: true, width: '15%' },
    { field: 'brand', header: 'Brand', sortable: true, width: '12%' },
    { field: 'rating', header: 'Rating', sortable: true, width: '10%', type: 'rating' },
    { field: 'thumbnail', header: 'Image', sortable: false, width: '18%', type: 'image' },
  ];

  initialSearch = '';

  readonly productsState$ = this.route.queryParams.pipe(
    debounceTime(300),
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
    map((params): ProductsQueryParams => ({
      page: params['page'] ? +params['page'] : 1,
      limit: params['limit'] ? +params['limit'] : 10,
      search: params['search'] || undefined,
      sortBy: params['sortBy'] || undefined,
      sortOrder: params['sortOrder'] as 'asc' | 'desc' || undefined,
    })),
    switchMap((params) =>
      this.productsService.getProducts(params).pipe(
        map((response): ProductsState => ({
          products: response.products,
          loading: false,
          error: null,
          totalRecords: response.total,
          page: params.page ?? 1,
          rows: params.limit ?? 10,
          search: params.search || '',
          sortBy: params.sortBy || '',
          sortOrder: params.sortOrder || 'asc',
        })),
        startWith<ProductsState>({
          products: [],
          loading: true,
          error: null,
          totalRecords: 0,
          page: params.page ?? 1,
          rows: params.limit ?? 10,
          search: params.search || '',
          sortBy: params.sortBy || '',
          sortOrder: params.sortOrder || 'asc',
        }),
        catchError((err): import('rxjs').Observable<ProductsState> => {
          console.error('Failed to load products', err);
          return of({
            products: [],
            loading: false,
            error: 'Failed to load products',
            totalRecords: 0,
            page: params.page ?? 1,
            rows: params.limit ?? 10,
            search: params.search || '',
            sortBy: params.sortBy || '',
            sortOrder: params.sortOrder || 'asc',
          });
        })
      )
    )
  );

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    this.initialSearch = params['search'] || '';
  }

  onPageChange(event: { page: number; rows: number }): void {
    const currentLimit = this.route.snapshot.queryParams['limit'] ? +this.route.snapshot.queryParams['limit'] : 10;
    
    // Only include limit if it actually changed
    if (event.rows === currentLimit) {
      this.updateQueryParams({ page: event.page });
    } else {
      this.updateQueryParams({ page: event.page, limit: event.rows });
    }
  }

  onSearch(search: string): void {
    this.updateQueryParams({ search: search || null, page: 1 });
  }

  onSort(event: SortEvent): void {
    this.updateQueryParams({ sortBy: event.field, sortOrder: event.order, page: 1 });
  }

  private updateQueryParams(params: Record<string, string | number | null>): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }
}
