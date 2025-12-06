import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './products-table.component.html',
})
export class ProductsTableComponent implements OnInit {
  private productsService = inject(ProductsService);
  private platformId = inject(PLATFORM_ID);

  products: Product[] = [];
  loading = true;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProducts();
    } else {
      this.loading = false;
    }
  }

  loadProducts(): void {
    this.loading = true;
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.loading = false;
      },
    });
  }
}
