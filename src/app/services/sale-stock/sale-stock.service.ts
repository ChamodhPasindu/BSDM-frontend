import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IResponse } from 'src/app/interfaces/IResponse';
import { ISaleStock } from 'src/app/interfaces/ISaleStock';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable()
export class SaleStockService {
  private requestUrl = `${getEndpoint(SECURE)}/stock`;

  constructor(private readonly httpClient: HttpClient) {}

  public addSaleStock(payload: ISaleStock): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.requestUrl + '/assign-sales-stock',
      {
        ...payload,
      },
    );
  }

  public getSaleStockList(
    payload: IPagination,
    inputValue: string,
    fromDate?: string | null,
    toDate?: string | null,
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.requestUrl + '/sales/list', {
      ...payload,
      loadIdOrEmployeeOrVehicle: inputValue,
      fromDate: fromDate,
      toDate: toDate,
    });
  }

  public getSaleStockDetailsById(id: number): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.requestUrl + '/details/list',
      {},
      { params: { code: id } },
    );
  }

  public getSaleStockWidget(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.requestUrl + '/card-details/assigned',
      {},
    );
  }
}
