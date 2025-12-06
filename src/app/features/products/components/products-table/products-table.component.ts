import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  readonly productsState$: Observable<ProductsState> = this.productsService.getProducts().pipe(
    map((products) => ({ products, loading: false, error: null })),
    startWith({ products: [], loading: true, error: null }),
    catchError((err) => {
      console.error('Failed to load products', err);
      return of({ products: [], loading: false, error: 'Failed to load products' });
    })
  );
}
