import { Routes } from '@angular/router';
import { ProductsTableComponent } from './components/list/list.component';

export const productsRoutes: Routes = [
  {
    path: '',
    component: ProductsTableComponent,
  },
];
