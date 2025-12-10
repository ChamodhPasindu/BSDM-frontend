import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IResponse } from 'src/app/interfaces/IResponse';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable()
export class SaleStockService {
  private requestUrl = `${getEndpoint(SECURE)}/stock/sales`;

  constructor(private readonly httpClient: HttpClient) {}

  // public addProduct(payload: IProduct): Observable<IResponse> {
  //   return this.httpClient.post<IResponse>(this.requestUrl + '/add-product', {
  //     ...payload,
  //   });
  // }

  public getSaleStockList(
    payload: IPagination,
    inputValue: string,
    fromDate?: string | null,
    toDate?: string | null
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.requestUrl + '/list', {
      ...payload,
      loadIdOrEmployeeOrVehicle: inputValue,
      fromDate: fromDate,
      toDate: toDate,
    });
  }
}
