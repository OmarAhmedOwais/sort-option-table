import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { BehaviorSubject, of, switchMap, catchError, map, startWith } from 'rxjs';
import { Product, ProductsQueryParams } from '../../models/product.model';
import { DataTableComponent, TableColumn } from '../../../../shared';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalRecords: number;
  page: number;
  rows: number;
}

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './products-table.component.html',
})
export class ProductsTableComponent {
  private readonly productsService = inject(ProductsService);

  readonly columns: TableColumn[] = [
    { field: 'id', header: 'ID', sortable: true, width: '10%' },
    { field: 'title', header: 'Title', sortable: true, width: '25%' },
    { field: 'price', header: 'Price', sortable: true, width: '15%', type: 'currency' },
    { field: 'category', header: 'Category', sortable: true, width: '15%' },
    { field: 'rating.rate', header: 'Rating', sortable: true, width: '10%', type: 'rating' },
    { field: 'image', header: 'Image', sortable: false, width: '25%', type: 'image' },
  ];

  private readonly queryParams$ = new BehaviorSubject<ProductsQueryParams>({ page: 1, limit: 10 });

  readonly productsState$ = this.queryParams$.pipe(
    switchMap((params) =>
      this.productsService.getProducts(params).pipe(
        map((response): ProductsState => ({
          products: response.data,
          loading: false,
          error: null,
          totalRecords: response.pagination.total,
          page: response.pagination.page,
          rows: response.pagination.limit,
        })),
        startWith<ProductsState>({
          products: [],
          loading: true,
          error: null,
          totalRecords: 0,
          page: params.page ?? 1,
          rows: params.limit ?? 10,
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
          });
        })
      )
    )
  );

  onPageChange(event: { page: number; rows: number }): void {
    this.queryParams$.next({ page: event.page, limit: event.rows });
  }
}
