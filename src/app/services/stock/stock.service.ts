import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IResponse } from 'src/app/interfaces/IResponse';
import { IStock } from 'src/app/interfaces/IStock';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable()
export class StockService {
  private requestUrl = `${getEndpoint(SECURE)}/stock`;

  constructor(private readonly httpClient: HttpClient) {}

  public addStock(payload: IStock[], reason?: string): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.requestUrl + '/add-stock', {
      reason: reason,
      stockUpdates: payload,
    });
  }

  public updateStock(
    productId: number,
    quantity: number,
    reason: string,
  ): Observable<IResponse> {
    return this.httpClient.put<IResponse>(this.requestUrl + '/adjust-stock', {
      productId: productId,
      quantity: quantity,
      reason: reason,
    });
  }

  public deleteStock(productId: number): Observable<IResponse> {
    return this.httpClient.delete<IResponse>(
      this.requestUrl + '/remove-stock',
      {
        body: {
          productId: productId,
        },
      },
    );
  }

  public getStockList(
    payload: IPagination,
    inputValue: string,
    fromDate?: string | null,
    toDate?: string | null,
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.requestUrl + '/store/list', {
      ...payload,
      stockIdOrProductName: inputValue,
      fromDate: fromDate,
      toDate: toDate,
    });
  }

  public getStockById(id: number): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.requestUrl + '/store/detailsById',
      {},
      { params: { code: id } },
    );
  }

  public getStockAssignedProductList(
    payload: IPagination,
    inputValue: string,
    fromDate?: string | null,
    toDate?: string | null,
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.requestUrl + '/list', {
      ...payload,
      productNameOrBatchCodeOrDescription: inputValue,
      fromDate: fromDate,
      toDate: toDate,
    });
  }
}
