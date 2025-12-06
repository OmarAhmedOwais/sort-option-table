import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { Observable, of, startWith, catchError, map } from 'rxjs';
import { Product } from '../../models/product.model';
import { DataTableComponent, TableColumn } from '../../../../shared';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './products-table.component.html',
})
export class ProductsTableComponent {
  private productsService = inject(ProductsService);

  readonly columns: TableColumn[] = [
    { field: 'id', header: 'ID', sortable: true, width: '10%' },
    { field: 'title', header: 'Title', sortable: true, width: '25%' },
    { field: 'price', header: 'Price', sortable: true, width: '15%', type: 'currency' },
    { field: 'category', header: 'Category', sortable: true, width: '15%' },
    { field: 'rating.rate', header: 'Rating', sortable: true, width: '10%', type: 'rating' },
    { field: 'image', header: 'Image', sortable: false, width: '25%', type: 'image' },
  ];

  readonly productsState$: Observable<ProductsState> = this.productsService.getProducts().pipe(
    map((products) => ({ products, loading: false, error: null })),
    startWith({ products: [], loading: true, error: null }),
    catchError((err) => {
      console.error('Failed to load products', err);
      return of({ products: [], loading: false, error: 'Failed to load products' });
    })
  );
}
