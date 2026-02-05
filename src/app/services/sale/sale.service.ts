import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IResponse } from 'src/app/interfaces/IResponse';
import { ISale } from 'src/app/interfaces/ISale';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private salesRequestUrl = `${getEndpoint(SECURE)}/sales-man`;
  private adminRequestUrl = `${getEndpoint(SECURE)}/sales`;

  private saleInitData: Record<string, string> | null = null;
  private saleCompleteData: Record<string, string> | null = null;

  constructor(private readonly httpClient: HttpClient) {}

  public setSaleInitData(data: Record<string, string>): void {
    this.saleInitData = data;
  }

  public getSaleInitData(): Record<string, string> | null {
    return this.saleInitData;
  }

  public setSaleCompleteData(data: Record<string, string>): void {
    this.saleCompleteData = data;
  }

  public getSaleCompleteData(): Record<string, string> | null {
    return this.saleCompleteData;
  }

  public saleInit(customerId: number, routeId: number): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.salesRequestUrl + '/order/init',
      {
        customerId: customerId,
        routeId: routeId,
      },
    );
  }

  public placeOrder(payload: ISale): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.salesRequestUrl + '/order/items',
      {
        ...payload,
      },
    );
  }

  public getSaleList(
    payload: Partial<IPagination>,
    order?: string,
    customer?: string,
    driver?: string,
    status?: string,
    fromDate?: string | null,
    toDate?: string | null,
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.adminRequestUrl + '/list', {
      ...payload,
      orderRefOrOrderId: order,
      customerNameOrCustomerId: customer,
      employeeNameOrEmployeeId: driver,
      status: status,
      fromDate: fromDate,
      toDate: toDate,
    });
  }

  public getSaleById(id: number): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.adminRequestUrl + '/find',
      { params: { orderId: id } },
    );
  }

  public getSaleItemList(
    payload: IPagination,
    inputValue: string,
    fromDate?: string | null,
    toDate?: string | null,
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.adminRequestUrl + '/item-list',
      {
        ...payload,
        itemNameOrItemId: inputValue,
        fromDate: fromDate,
        toDate: toDate,
      },
    );
  }

  public getSaleItemById(id: number): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.adminRequestUrl + '/item-find',
      { params: { itemId: id } },
    );
  }
}
