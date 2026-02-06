import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable()
export class AlertService {
  private salesRequestUrl = `${getEndpoint(SECURE)}/sales-man`;

  constructor(private readonly httpClient: HttpClient) {}
}
