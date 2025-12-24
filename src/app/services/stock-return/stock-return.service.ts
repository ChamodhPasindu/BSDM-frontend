import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IResponse } from 'src/app/interfaces/IResponse';
import { IReturnStock } from 'src/app/interfaces/IReturnStock';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable()
export class StockReturnService {
  private requestUrl = `${getEndpoint(SECURE)}/stock`;

  constructor(private readonly httpClient: HttpClient) {}

  public addReturnStock(payload: IReturnStock): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.requestUrl + '/return-sales-stock',
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
    return this.httpClient.post<IResponse>(this.requestUrl + '/return/list', {
      ...payload,
      returnIdOrEmployeeOrLoadId: inputValue,
      fromDate: fromDate,
      toDate: toDate,
    });
  }
}
