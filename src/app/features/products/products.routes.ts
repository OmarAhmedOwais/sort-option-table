import { Routes } from '@angular/router';
import { ProductsTableComponent } from './components/products-table/products-table.component';

export const productsRoutes: Routes = [
  {
    path: '',
    component: ProductsTableComponent,
  },
];
