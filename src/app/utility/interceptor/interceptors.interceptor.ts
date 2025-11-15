import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  finalize,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { Router } from '@angular/router';
import { RESPONSE_MESSAGES, RESPONSE_TITLES } from '../constants/response-message-title';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SESSION_DATA } from '../constants/session-data';
import { alertError } from '../helper';
import { IResponse } from 'src/app/interfaces/IResponse';

@Injectable()
export class Interceptor implements HttpInterceptor {
  private totalRequests = 0;
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private readonly router: Router,
    private readonly storageService: StorageService,
    private readonly loaderService: LoaderService,
    private readonly authService: AuthService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.totalRequests++;
    this.loaderService.setLoading(true);

    // Skip if request is marked as external
    if (request.headers.has('EXTERNAL')) {
      const modified = request.clone({
        headers: request.headers.delete('EXTERNAL'),
      });
      return this.handleResponse(modified, next);
    }

    // Get access token
    const token = this.storageService.get(SESSION_DATA.ACCESS_TOKEN);

    // Add Authorization header if token exists
    if (token) {
      request = this.addTokenHeader(request, token);
    }
    return this.handleResponse(request, next);
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handleResponse(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }

        let message = RESPONSE_MESSAGES.COMMON_ERROR_DES;

        if (error.error?.message) {
          message = error.error.message;
        } else {
          message =
            RESPONSE_MESSAGES.HTTP_ERROR[error.status] ||
            RESPONSE_MESSAGES.COMMON_ERROR_DES;

          if (error.status === 401) {
            this.storageService.clearSession();
            this.router.navigate(['/login']);
          }
        }

        const errorWithMessage = {
          ...error,
          message,
        };

        return throwError(() => errorWithMessage);
      }),
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this.loaderService.setLoading(false);
        }
      })
    );
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.storageService.get(SESSION_DATA.REFRESH_TOKEN);

      if (!refreshToken) {
        this.logout();
        return throwError(() => ({
          message: RESPONSE_MESSAGES.SESSION_EXPIRED_DES,
        }));
      }

      return this.authService.refreshToken(refreshToken).pipe(
        switchMap((response: IResponse) => {
          this.isRefreshing = false;

          // save new tokens
          this.storageService.set(
            SESSION_DATA.ACCESS_TOKEN,
            response.body.content.accessToken
          );
          this.storageService.set(
            SESSION_DATA.REFRESH_TOKEN,
            response.body.content.refreshToken
          );

          this.refreshTokenSubject.next(response.body.content.accessToken);

          // retry original request
          return next.handle(
            this.addTokenHeader(request, response.body.content.accessToken)
          );
        }),
        catchError(() => {
          this.isRefreshing = false;
          this.logout();
          return throwError(() => ({
            message: RESPONSE_MESSAGES.SESSION_EXPIRED_DES,
          }));
        })
      );
    }

    // If refresh is already happening, wait until it is done
    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token!)))
    );
  }

  private logout(): void {
    this.storageService.clearSession();
    alertError({
      title: RESPONSE_TITLES.OOPS,
      text: RESPONSE_MESSAGES.SESSION_EXPIRED_DES,
    });
    this.router.navigate(['/login']);
  }
}
