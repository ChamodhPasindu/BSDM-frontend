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

  public addStock(reason: string, payload: IStock[]): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.requestUrl + '/add-stock', {
      reason: reason,
      stockUpdates: payload,
    });
  }

  public deleteStock(productId: number): Observable<IResponse> {
    return this.httpClient.delete<IResponse>(
      this.requestUrl + '/remove-stock',
      {
        body: {
          productId: productId,
        },
      }
    );
  }

  public getStockList(
    payload: IPagination,
    inputValue: string,
    fromDate: string | null,
    toDate: string | null
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.requestUrl + '/store/list', {
      ...payload,
      stockIdOrProductName: inputValue,
      fromDate: fromDate,
      toDate: toDate,
    });
  }
}
