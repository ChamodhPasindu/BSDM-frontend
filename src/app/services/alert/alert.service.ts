import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { INotification } from 'src/app/interfaces/INotification';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IResponse } from 'src/app/interfaces/IResponse';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable()
export class AlertService {
  private requestUrl = `${getEndpoint(SECURE)}/notifications`;

  constructor(private readonly httpClient: HttpClient) {}

  public addNotification(payload: INotification): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.requestUrl + '/admin/send', {
      ...payload,
    });
  }

  public getAdminNotificationList(
    payload: Partial<IPagination>,
    username?: string,
    isRead?: boolean | null,
    title?: string | null,
    fromDate?: string | null,
    toDate?: string | null,
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.requestUrl + '/list', {
      ...payload,
      recipientUserNameOrUsername: username,
      isRead: isRead,
      title: title,
      fromDate: fromDate,
      toDate: toDate,
    });
  }

  public getNotificationList(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(this.requestUrl, {});
  }

  public markAsReadNotification(id: number): Observable<IResponse> {
    return this.httpClient.put<IResponse>(
      this.requestUrl + '/read',
      {},
      { params: { id: id } },
    );
  }
}
