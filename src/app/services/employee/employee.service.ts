import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEmployee } from 'src/app/interfaces/IEmployee';
import { IResponse } from 'src/app/interfaces/IResponse';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable()
export class EmployeeService {
  private requestUrl = `${getEndpoint(SECURE)}`;

  constructor(private readonly httpClient: HttpClient) {}

  public createEmployee(payload: IEmployee): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.requestUrl + '/sign-in/creat-user',
      {
        ...payload,
      }
    );
  }

  public validateNIC(nic: string): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.requestUrl + '/sign-up/validate-nic',
      {},
      { params: { nic: nic } }
    );
  }

  public validateUsername(username: string): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.requestUrl + '/sign-up/validate-username',
      {},
      { params: { userName: username } }
    );
  }
}
