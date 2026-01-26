import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBillData } from 'src/app/interfaces/IBillData';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IPaymentSalesman } from 'src/app/interfaces/IPaymentSalesman';
import { IPaymentAdmin } from 'src/app/interfaces/IPaymentAdmin';
import { IResponse } from 'src/app/interfaces/IResponse';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private salesRequestUrl = `${getEndpoint(SECURE)}/sales-man`;
  private adminRequestUrl = `${getEndpoint(SECURE)}/payments`;

  private selectedBill: IBillData | null = null;

  constructor(private readonly httpClient: HttpClient) {}

  public setSelectedBill(bill: IBillData): void {
    this.selectedBill = bill;
  }

  public getSelectedBill(): IBillData | null {
    return this.selectedBill;
  }

  public getPaymentList(
    payload: Partial<IPagination>,
    payment?: string,
    customer?: string,
    driver?: string,
    status?: string,
    fromDate?: string | null,
    toDate?: string | null,
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.adminRequestUrl + '/list', {
      ...payload,
      paymentIdOrOrderId: payment,
      customerNameOrCustomerId: customer,
      employeeNameOrEmployeeId: driver,
      status: status,
      fromDate: fromDate,
      toDate: toDate,
    });
  }

  public getPaymentById(id: number): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.adminRequestUrl + '/details',
      {},
      { params: { id: id } },
    );
  }

  public adminSettlePayment(payload: IPaymentAdmin): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.adminRequestUrl + '/pay',
      {
        ...payload,
      },
    );
  }

  // Salesman API

  public salesmanSettlePayment(payload: IPaymentSalesman): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.salesRequestUrl + '/payment/pay',
      {
        ...payload,
      },
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
      },
    );
  }

  public getPaymentSummary(id: string): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.salesRequestUrl + '/order/summary',
      { params: { referenceNumber: id } },
    );
  }
}
