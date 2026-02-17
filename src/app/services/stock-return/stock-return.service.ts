import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IResponse } from 'src/app/interfaces/IResponse';
import { IReturnStock } from 'src/app/interfaces/IReturnStock';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable()
export class StockReturnService {
  private adminRequestUrl = `${getEndpoint(SECURE)}`;
  private salesRequestUrl = `${getEndpoint(SECURE)}/sales-man`;

  constructor(private readonly httpClient: HttpClient) {}

  public addReturnStock(payload: IReturnStock): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.adminRequestUrl + '/return/return-sales-stock',
      {
        ...payload,
      },
    );
  }

  public getReturnStockList(
    payload: IPagination,
    inputValue: string,
    fromDate?: string | null,
    toDate?: string | null,
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.adminRequestUrl + '/stock/return/list',
      {
        ...payload,
        returnIdOrEmployeeOrLoadId: inputValue,
        fromDate: fromDate,
        toDate: toDate,
      },
    );
  }

  public getReturnStockDetailsById(id: number): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.adminRequestUrl + '/stock/return/details/list',
      {},
      { params: { code: id } },
    );
  }

  public getReturnDropDownList(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.adminRequestUrl + '/return/drop-down',
      {},
    );
  }

  public getReApprovedReturnDropDownList(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.adminRequestUrl + '/return/pending',
      {},
    );
  }

  public getSaleStockDetailsById(id: string): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.adminRequestUrl + '/return/sales-status',
      { params: { id: id } },
    );
  }

  public reconfirmReturn(id: number): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.adminRequestUrl + '/return/confirm',
      {},
      { params: { loadId: id } },
    );
  }

  public getReturnStockWidget(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.adminRequestUrl + '/return/card-details',
      {},
    );
  }

  // Salesman API

  public ReturnAllRemainingProduct(): Observable<IResponse> {
    return this.httpClient.put<IResponse>(
      this.salesRequestUrl + '/product/return',
      {},
    );
  }
}
