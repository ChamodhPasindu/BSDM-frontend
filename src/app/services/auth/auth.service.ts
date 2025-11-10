import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private requestUrl = `${getEndpoint(SECURE)}`;

  constructor(private readonly httpClient: HttpClient) {}
}
