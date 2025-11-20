import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  distinctUntilChanged,
  fromEvent,
  mapTo,
  merge,
} from 'rxjs';
import { CommonCode } from 'src/app/enums/CommonCode.enum';
import { IResponse } from 'src/app/interfaces/IResponse';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private readonly requestUrl = `${getEndpoint(SECURE)}/reference`;

  constructor(private readonly httpClient: HttpClient) {}

  get isOnlineChanges$(): Observable<boolean> {
    return merge(
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    ).pipe(distinctUntilChanged());
  }

  public getStatusList(code: CommonCode): Observable<IResponse> {
    return this.httpClient.get<IResponse>(this.requestUrl + '/get-status', {
      params: { code: code },
    });
  }

  public getDropDownList(code: CommonCode): Observable<IResponse> {
    return this.httpClient.get<IResponse>(this.requestUrl + '/drop-down', {
      params: { code: code },
    });
  }
}
