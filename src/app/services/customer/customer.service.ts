import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICustomer } from 'src/app/interfaces/ICustomer';
import { ICustomerData } from 'src/app/interfaces/ICustomerData';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IResponse } from 'src/app/interfaces/IResponse';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable()
export class CustomerService {
  private adminRequestUrl = `${getEndpoint(SECURE)}/customer`;
  private salesRequestUrl = `${getEndpoint(SECURE)}/sales-man`;

  private selectedCustomer: Partial<ICustomerData> | null;

  constructor(private readonly httpClient: HttpClient) {}

  public setSelectedCustomer(customer:  Partial<ICustomerData> | null): void {
    this.selectedCustomer = customer;
  }

  public getSelectedCustomer():  Partial<ICustomerData> | null {
    return this.selectedCustomer;
  }

  public addCustomer(
    routeId: number,
    payload: ICustomer[]
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.adminRequestUrl + '/add', {
      routeId: routeId,
      customerDetails: payload,
    });
  }

  public updateCustomer(
    routeId: number,
    payload: ICustomer[]
  ): Observable<IResponse> {
    return this.httpClient.put<IResponse>(this.adminRequestUrl + '/edit', {
      routeId: routeId,
      customerDetails: payload,
    });
  }

  public deleteCustomer(
    routeId: number,
    payload: Partial<ICustomer>[]
  ): Observable<IResponse> {
    return this.httpClient.delete<IResponse>(this.adminRequestUrl + '/delete', {
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
    return this.httpClient.post<IResponse>(this.adminRequestUrl + '/list', {
      ...payload,
      customerNameOrRouteNameOrShopName: inputValue,
      fromDate: fromDate,
      toDate: toDate,
    });
  }

  // Salesman API

  public getSalesmanCustomerListByRouteId(id: number): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.salesRequestUrl + '/customer-list',
      { pageable: false },
      { params: { id: id } }
    );
  }
}
