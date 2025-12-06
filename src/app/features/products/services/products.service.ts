import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../core';
import { ProductsResponse, ProductsQueryParams } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_CONFIG.baseUrl;
  private readonly endpoints = API_CONFIG.endpoints;

  getProducts(params?: ProductsQueryParams): Observable<ProductsResponse> {
    const httpParams = this.buildHttpParams(params);
    const url = this.getProductsUrl(params?.search);

    return this.http.get<ProductsResponse>(url, { params: httpParams });
  }

  private getProductsUrl(search?: string): string {
    const endpoint = search ? this.endpoints.productsSearch : this.endpoints.products;
    return `${this.baseUrl}${endpoint}`;
  }

  private buildHttpParams(params?: ProductsQueryParams): HttpParams {
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

    if (params?.search) {
      httpParams = httpParams.set('q', params.search);
    }

    return httpParams;
  }
}
