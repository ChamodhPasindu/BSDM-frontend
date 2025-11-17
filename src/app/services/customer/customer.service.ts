import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICustomer } from 'src/app/interfaces/ICustomer';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IResponse } from 'src/app/interfaces/IResponse';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable()
export class CustomerService {
  private requestUrl = `${getEndpoint(SECURE)}/customer`;

  constructor(private readonly httpClient: HttpClient) {}

  public addCustomer(
    routeId: number,
    payload: ICustomer[]
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.requestUrl + '/add', {
      routeId: routeId,
      customerDetails: payload,
    });
  }

  public updateCustomer(
    routeId: number,
    payload: ICustomer[]
  ): Observable<IResponse> {
    return this.httpClient.put<IResponse>(this.requestUrl + '/edit', {
      routeId: routeId,
      customerDetails: payload,
    });
  }

  public deleteCustomer(
    routeId: number,
    payload: Partial<ICustomer>[]
  ): Observable<IResponse> {
    return this.httpClient.delete<IResponse>(this.requestUrl + '/delete', {
      body: {
        routeId: routeId,
        customerDetails: payload,
      },
    });
  }

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
