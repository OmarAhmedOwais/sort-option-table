import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ProductsService } from '../../services/products.service';
import { Observable, of, startWith, catchError, map } from 'rxjs';
import { Product } from '../../models/product.model';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './products-table.component.html',
})
export class ProductsTableComponent {
  private productsService = inject(ProductsService);
  private platformId = inject(PLATFORM_ID);

  readonly productsState$: Observable<ProductsState> = isPlatformBrowser(this.platformId)
    ? this.productsService.getProducts().pipe(
        map((products) => ({ products, loading: false, error: null })),
        startWith({ products: [], loading: true, error: null }),
        catchError((err) => {
          console.error('Failed to load products', err);
          return of({ products: [], loading: false, error: 'Failed to load products' });
        })
      )
    : of({ products: [], loading: false, error: null });
}
