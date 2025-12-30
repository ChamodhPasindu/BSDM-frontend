import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProductData } from 'src/app/interfaces/IProductData';
import { IResponse } from 'src/app/interfaces/IResponse';
import { ISale } from 'src/app/interfaces/ISale';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private salesRequestUrl = `${getEndpoint(SECURE)}/sales-man`;

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
      }
    );
  }

  public placeOrder(payload: ISale): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.salesRequestUrl + '/order/items',
      {
        ...payload,
      }
    );
  }

  public getOrderSummary(id: string): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.salesRequestUrl + '/order/summary',
      { params: { referenceNumber: id } }
    );
  }
}
