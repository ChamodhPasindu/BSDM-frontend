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

  private paymentCompleteData: IPayment | null = null;
  private selectedBill:IBillData | null = null;

  constructor(private readonly httpClient: HttpClient) {}

  public setPaymentCompleteData(data: IPayment): void {
    this.paymentCompleteData = data;
  }

  public getPaymentCompleteData(): IPayment | null {
    return this.paymentCompleteData;
  }

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
    routeId: number
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.salesRequestUrl + '/order/order-list',
      {
        customerId: customerId,
        routeId: routeId,
      }
    );
  }
}
