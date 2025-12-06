import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { of, switchMap, catchError, map, startWith, debounceTime, distinctUntilChanged } from 'rxjs';
import { Product, ProductsQueryParams } from '../../models/product.model';
import { DataTableComponent, SearchInputComponent, TableColumn } from '../../../../shared';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalRecords: number;
  page: number;
  rows: number;
  search: string;
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
    { field: 'id', header: 'ID', sortable: true, width: '10%' },
    { field: 'title', header: 'Title', sortable: true, width: '25%' },
    { field: 'price', header: 'Price', sortable: true, width: '15%', type: 'currency' },
    { field: 'category', header: 'Category', sortable: true, width: '15%' },
    { field: 'rating.rate', header: 'Rating', sortable: true, width: '10%', type: 'rating' },
    { field: 'image', header: 'Image', sortable: false, width: '25%', type: 'image' },
  ];

  initialSearch = '';

  readonly productsState$ = this.route.queryParams.pipe(
    debounceTime(300),
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
    map((params): ProductsQueryParams => ({
      page: params['page'] ? +params['page'] : 1,
      limit: params['limit'] ? +params['limit'] : 10,
      search: params['search'] || undefined,
    })),
    switchMap((params) =>
      this.productsService.getProducts(params).pipe(
        map((response): ProductsState => ({
          products: response.data,
          loading: false,
          error: null,
          totalRecords: response.pagination.total,
          page: response.pagination.page,
          rows: response.pagination.limit,
          search: params.search || '',
        })),
        startWith<ProductsState>({
          products: [],
          loading: true,
          error: null,
          totalRecords: 0,
          page: params.page ?? 1,
          rows: params.limit ?? 10,
          search: params.search || '',
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
    this.updateQueryParams({ page: event.page, limit: event.rows });
  }

  onSearch(search: string): void {
    this.updateQueryParams({ search: search || null, page: 1 });
  }

  private updateQueryParams(params: Record<string, string | number | null>): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }
}
