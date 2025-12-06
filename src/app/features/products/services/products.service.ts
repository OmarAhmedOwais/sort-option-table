import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsResponse, ProductsQueryParams } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://fakeapi.net/products';

  getProducts(params?: ProductsQueryParams): Observable<ProductsResponse> {
    let httpParams = new HttpParams();

    if (params?.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }
    if (params?.category) {
      httpParams = httpParams.set('category', params.category);
    }
    if (params?.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params?.price) {
      httpParams = httpParams.set('price', JSON.stringify(params.price));
    }

    return this.http.get<ProductsResponse>(this.apiUrl, { params: httpParams });
  }
}
