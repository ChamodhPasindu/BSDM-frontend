import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBillData } from 'src/app/interfaces/IBillData';
import { IPayment } from 'src/app/interfaces/IPayment';
import { IResponse } from 'src/app/interfaces/IResponse';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private salesRequestUrl = `${getEndpoint(SECURE)}/sales-man`;

  private selectedBill: IBillData | null = null;

  constructor(private readonly httpClient: HttpClient) {}

  public setSelectedBill(bill: IBillData): void {
    this.selectedBill = bill;
  }

  public getSelectedBill(): IBillData | null {
    return this.selectedBill;
  }

  public settlePayment(payload: IPayment): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.salesRequestUrl + '/payment/pay',
      {
        ...payload,
      }
    );
  }

  public getBillList(
    customerId: number,
    routeId: number,
    startOfDay: string | undefined,
    endOfDay: string | undefined,
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.salesRequestUrl + '/order/order-list',
      {
        customerId: customerId,
        routeId: routeId,
        startOfDay: startOfDay,
        endOfDay: endOfDay,
      }
    );
  }

  public getPaymentSummary(id: string): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.salesRequestUrl + '/order/summary',
      { params: { referenceNumber: id } }
    );
  }
}
