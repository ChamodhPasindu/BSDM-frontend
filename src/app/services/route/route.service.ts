import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from 'src/app/interfaces/IResponse';
import { IRoute } from 'src/app/interfaces/IRoute';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable()
export class RouteService {
  private requestUrl = `${getEndpoint(SECURE)}`;

  constructor(private readonly httpClient: HttpClient) {}

  public addRoute(payload: IRoute): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.requestUrl + '/route/add',
      {
        ...payload,
      }
    );
  }
}
