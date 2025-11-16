import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IResponse } from 'src/app/interfaces/IResponse';
import { IRoute } from 'src/app/interfaces/IRoute';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable()
export class RouteService {
  private requestUrl = `${getEndpoint(SECURE)}/route`;

  constructor(private readonly httpClient: HttpClient) {}

  public addRoute(payload: IRoute): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.requestUrl + '/add', {
      ...payload,
    });
  }

  public updateRoute(payload: IRoute): Observable<IResponse> {
    return this.httpClient.put<IResponse>(this.requestUrl + '/edit', {
      ...payload,
    });
  }

  public deleteRoute(routeId: number): Observable<IResponse> {
    return this.httpClient.delete<IResponse>(
      this.requestUrl + '/delete',
      {
        body: {
          routeId: routeId,
        },
      }
    );
  }

  public getRouteList(
    payload: IPagination,
    inputValue: string,
    fromDate: string | null,
    toDate: string | null
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.requestUrl + '/list', {
      ...payload,
      routeName: inputValue,
      fromDate: fromDate,
      toDate: toDate,
    });
  }
}
