import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IResponse } from 'src/app/interfaces/IResponse';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable()
export class CustomerService {
  private requestUrl = `${getEndpoint(SECURE)}/customer`;

  constructor(private readonly httpClient: HttpClient) {}

  public getCustomerList(
    payload: IPagination,
    inputValue: string,
    fromDate: string | null,
    toDate: string | null
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.requestUrl + '/list', {
      ...payload,
      customerNameOrRouteNameOrShopName: inputValue,
      fromDate: fromDate,
      toDate: toDate,
    });
  }
}
