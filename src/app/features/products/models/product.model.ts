export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  brand: string;
  stock: number;
  image: string;
  specs: {
    color: string;
    weight: string;
    storage: string;
  };
  rating: {
    rate: number;
    count: number;
  };
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  price?: {
    min?: number;
    max?: number;
  };
}
