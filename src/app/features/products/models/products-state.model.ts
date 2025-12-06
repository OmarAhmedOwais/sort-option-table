import { Product } from './product.model';

export interface ProductsState {
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

export const initialProductsState = (params: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): ProductsState => ({
  products: [],
  loading: true,
  error: null,
  totalRecords: 0,
  page: params.page ?? 1,
  rows: params.limit ?? 10,
  search: params.search || '',
  sortBy: params.sortBy || '',
  sortOrder: params.sortOrder || 'asc',
});

export const errorProductsState = (params: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): ProductsState => ({
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
