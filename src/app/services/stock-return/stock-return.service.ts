import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IResponse } from 'src/app/interfaces/IResponse';
import { IReturnStock } from 'src/app/interfaces/IReturnStock';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable()
export class StockReturnService {
  private requestUrl = `${getEndpoint(SECURE)}`;

  constructor(private readonly httpClient: HttpClient) {}

  public addReturnStock(payload: IReturnStock): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.requestUrl + '/return/return-sales-stock',
      {
        ...payload,
      }
    );
  }

  public getReturnStockList(
    payload: IPagination,
    inputValue: string,
    fromDate?: string | null,
    toDate?: string | null
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.requestUrl + '/stock/return/list',
      {
        ...payload,
        returnIdOrEmployeeOrLoadId: inputValue,
        fromDate: fromDate,
        toDate: toDate,
      }
    );
  }

  public getReturnStockDetailsById(id: number): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.requestUrl + '/stock/return/details/list',
      {},
      { params: { code: id } }
    );
  }

  public getReturnDropDownList(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.requestUrl + '/return/drop-down',
      {}
    );
  }

  public getSaleStockDetailsById(id: string): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.requestUrl + '/return/sales-status',
      { params: { id: id } }
    );
  }
}
