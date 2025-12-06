import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsResponse, ProductsQueryParams } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://dummyjson.com/products';

  getProducts(params?: ProductsQueryParams): Observable<ProductsResponse> {
    let httpParams = new HttpParams();
    const limit = params?.limit ?? 10;
    const page = params?.page ?? 1;
    const skip = (page - 1) * limit;

    httpParams = httpParams.set('limit', limit.toString());
    httpParams = httpParams.set('skip', skip.toString());

    if (params?.sortBy) {
      httpParams = httpParams.set('sortBy', params.sortBy);
      httpParams = httpParams.set('order', params.sortOrder ?? 'asc');
    }

    // Use search endpoint if search query is provided
    const url = params?.search
      ? `${this.baseUrl}/search`
      : this.baseUrl;

    if (params?.search) {
      httpParams = httpParams.set('q', params.search);
    }

    return this.http.get<ProductsResponse>(url, { params: httpParams });
  }
}
