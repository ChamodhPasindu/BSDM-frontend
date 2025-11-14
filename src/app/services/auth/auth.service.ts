import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { IResponse } from 'src/app/interfaces/IResponse';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn:'root'
})
export class AuthService {
  private readonly requestUrl = `${getEndpoint(SECURE)}`;

  constructor(
    private readonly httpClient: HttpClient,
  ) {}

  public signIn(username: string, password: string): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.requestUrl + '/sign-in/',
      {
        username: username,
        password: password,
      },
      { headers: { EXTERNAL: 'true' } }
    );
  }

  public refreshToken(refreshToken: string): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.requestUrl + '/sign-in/refresh-token',
      {
        refreshToken: refreshToken,
      }
    );
  }

  public logout(): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.requestUrl + '/sign-in/logout',
      {}
    );
  }
}
