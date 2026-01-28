import { HttpClient } from '@angular/common/http';
import { Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { ICustomizeRouteData } from 'src/app/interfaces/ICustomizeRouteData';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IResponse } from 'src/app/interfaces/IResponse';
import { IRoute } from 'src/app/interfaces/IRoute';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private adminRequestUrl = `${getEndpoint(SECURE)}/route`;
  private salesRequestUrl = `${getEndpoint(SECURE)}/sales-man`;

  private selectedRoute: ICustomizeRouteData | null;

  constructor(private readonly httpClient: HttpClient) {}

  public setSelectedRoute(route: ICustomizeRouteData | null): void {
    this.selectedRoute = route;
  }

  public getSelectedRoute(): ICustomizeRouteData | null {
    return this.selectedRoute;
  }

  public addRoute(payload: IRoute): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.adminRequestUrl + '/add', {
      ...payload,
    });
  }

  public updateRoute(payload: IRoute): Observable<IResponse> {
    return this.httpClient.put<IResponse>(this.adminRequestUrl + '/edit', {
      ...payload,
    });
  }

  public deleteRoute(routeId: number): Observable<IResponse> {
    return this.httpClient.delete<IResponse>(this.adminRequestUrl + '/delete', {
      body: {
        routeId: routeId,
      },
    });
  }

  public getRouteList(
    payload: Partial<IPagination>,
    inputValue?: string,
    fromDate?: string | null,
    toDate?: string | null,
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.adminRequestUrl + '/list', {
      ...payload,
      routeName: inputValue,
      fromDate: fromDate,
      toDate: toDate,
    });
  }

  public getRouteWidget(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.adminRequestUrl + '/card-details',
      {},
    );
  }

  // Salesman API

  public getSalesmanRouteList(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(this.salesRequestUrl + '/route-list');
  }
}
