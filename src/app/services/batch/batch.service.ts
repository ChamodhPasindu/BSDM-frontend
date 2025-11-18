import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBatch } from 'src/app/interfaces/IBatch';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IResponse } from 'src/app/interfaces/IResponse';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable()
export class BatchService {
  private requestUrl = `${getEndpoint(SECURE)}/product`;

  constructor(private readonly httpClient: HttpClient) {}

  public addBatch(payload: IBatch): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.requestUrl + '/add-batches', {
      ...payload,
    });
  }

  public updateBatch(payload: IBatch): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.requestUrl + '/edit-batches', {
      ...payload,
    });
  }

  public deleteBatch(batchId: number): Observable<IResponse> {
    return this.httpClient.delete<IResponse>(
      this.requestUrl + '/delete-batches',
      {
        body: {
          batchId: batchId,
        },
      }
    );
  }

  public getBatchList(
    payload: IPagination,
    inputValue: string,
    fromDate: string | null,
    toDate: string | null
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.requestUrl + '/batches/list', {
      ...payload,
      batchCode: inputValue,
      fromDate: fromDate,
      toDate: toDate,
    });
  }

  public getBatchCode(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(this.requestUrl + '/create/id');
  }
}
