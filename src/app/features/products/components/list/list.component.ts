import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap, catchError, map, startWith, debounceTime, distinctUntilChanged } from 'rxjs';

import { ProductsService } from '../../services/products.service';
import {
  ProductsQueryParams,
  ProductsState,
  initialProductsState,
  errorProductsState,
  PRODUCTS_TABLE_COLUMNS,
} from '../../models';
import { DataTableComponent, SearchInputComponent, SortEvent } from '../../../../shared';

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [DataTableComponent, SearchInputComponent],
  templateUrl: './list.component.html',
})
export class ProductsTableComponent {
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly columns = PRODUCTS_TABLE_COLUMNS;

  // Convert query params to signal
  private readonly queryParams = toSignal(
    this.route.queryParams.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      map((params): ProductsQueryParams => ({
        page: params['page'] ? +params['page'] : 1,
        limit: params['limit'] ? +params['limit'] : 10,
        search: params['search'] || undefined,
        sortBy: params['sortBy'] || undefined,
        sortOrder: (params['sortOrder'] as 'asc' | 'desc') || undefined,
      }))
    ),
    { initialValue: { page: 1, limit: 10 } as ProductsQueryParams }
  );

  // Products state as signal
  readonly productsState = toSignal(
    this.route.queryParams.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      map((params): ProductsQueryParams => ({
        page: params['page'] ? +params['page'] : 1,
        limit: params['limit'] ? +params['limit'] : 10,
        search: params['search'] || undefined,
        sortBy: params['sortBy'] || undefined,
        sortOrder: (params['sortOrder'] as 'asc' | 'desc') || undefined,
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
          startWith<ProductsState>(initialProductsState(params)),
          catchError((err) => {
            console.error('Failed to load products', err);
            return of(errorProductsState(params));
          })
        )
      )
    ),
    { initialValue: initialProductsState({ page: 1, limit: 10 }) }
  );

  // Computed value for current limit
  private readonly currentLimit = computed(() => this.queryParams().limit ?? 10);

  onPageChange(event: { page: number; rows: number }): void {
    if (event.rows === this.currentLimit()) {
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
