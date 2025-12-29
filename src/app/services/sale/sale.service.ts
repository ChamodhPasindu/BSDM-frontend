import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/interfaces/IResponse';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable()
export class SaleService {
  private salesRequestUrl = `${getEndpoint(SECURE)}/sales-man`;

  private saleInitData: Record<string,string> | null = null;

  constructor(private readonly httpClient: HttpClient) {}

  public setSaleInitData(data: Record<string,string>): void {
    this.saleInitData = data;
  }

  public getSaleInitData(): Record<string,string> | null {
    return this.saleInitData;
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
}
