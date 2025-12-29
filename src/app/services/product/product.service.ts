import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IProduct } from 'src/app/interfaces/IProduct';
import { IResponse } from 'src/app/interfaces/IResponse';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable()
export class ProductService {
  private adminRequestUrl = `${getEndpoint(SECURE)}/product`;
  private salesRequestUrl = `${getEndpoint(SECURE)}/sales-man/product`;

  constructor(private readonly httpClient: HttpClient) {}

  public addProduct(payload: IProduct): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.adminRequestUrl + '/add-product',
      {
        ...payload,
      }
    );
  }

  public updateProduct(payload: IProduct): Observable<IResponse> {
    return this.httpClient.put<IResponse>(
      this.adminRequestUrl + '/edit-product',
      {
        ...payload,
      }
    );
  }

  public deleteProduct(productId: number): Observable<IResponse> {
    return this.httpClient.delete<IResponse>(
      this.adminRequestUrl + '/delete-product',
      {
        body: {
          productId: productId,
        },
      }
    );
  }

  public getProductList(
    payload: IPagination,
    inputValue: string,
    fromDate?: string | null,
    toDate?: string | null
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.adminRequestUrl + '/list', {
      ...payload,
      productNameOrBatchCodeOrDescription: inputValue,
      fromDate: fromDate,
      toDate: toDate,
    });
  }

  // Salesman API

  public getSalesmanProductList(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(this.salesRequestUrl + '/list');
  }
}
