import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/interfaces/IResponse';
import { getEndpoint, SECURE } from 'src/app/utility/common/end-point';

@Injectable()
export class DashboardService {
  private adminRequestUrl = `${getEndpoint(SECURE)}/admin-dashboard`;
  private salesRequestUrl = `${getEndpoint(SECURE)}/sales-man/dashboard`;

  constructor(private readonly httpClient: HttpClient) {}

  public getAdminTotalCards(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.adminRequestUrl + '/card-details',
    );
  }

  public getRecentTransaction(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.adminRequestUrl + '/recent-transaction',
    );
  }

  public getRecentOrders(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.adminRequestUrl + '/recent-orders',
    );
  }

  public getBestSellingProducts(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.adminRequestUrl + '/best-selling',
    );
  }

  public getSalesGrowth(period: string): Observable<IResponse> {
    return this.httpClient.get<IResponse>(this.adminRequestUrl + '/growth', {
      params: { period },
    });
  }

  public getSalesmanTotalCards(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.salesRequestUrl + '/card-details',
    );
  }

  public getRouteCards(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.salesRequestUrl + '/route-details',
    );
  }

  public getRemainingProductDetails(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.salesRequestUrl + '/low-product-details',
    );
  }

  public getMetricsDetails(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.salesRequestUrl + '/get-metrics',
    );
  }
}
