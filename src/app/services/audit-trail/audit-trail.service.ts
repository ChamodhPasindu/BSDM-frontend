import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IResponse } from 'src/app/interfaces/IResponse';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable()
export class AuditTrailService {
  private requestUrl = `${getEndpoint(SECURE)}`;

  constructor(private readonly httpClient: HttpClient) {}

  public getAuditList(
    payload: Partial<IPagination>,
    username?: string,
    action?: string,
    status?: string,
    fromDate?: string | null,
    toDate?: string | null,
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.requestUrl + '/audit/list', {
      ...payload,
      username: username,
      action: action,
      status: status,
      fromDate: fromDate,
      toDate: toDate,
      sortBy: 'createdAt',
      sortDir: 'DESC',
    });
  }
}
