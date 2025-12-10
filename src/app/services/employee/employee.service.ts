import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEmployee } from 'src/app/interfaces/IEmployee';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IResponse } from 'src/app/interfaces/IResponse';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable()
export class EmployeeService {
  private requestUrl = `${getEndpoint(SECURE)}`;

  constructor(private readonly httpClient: HttpClient) {}

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

  public createEmployee(payload: IEmployee): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.requestUrl + '/sign-up/creat-user',
      {
        ...payload,
      }
    );
  }

  public updateEmployee(payload: IEmployee): Observable<IResponse> {
    return this.httpClient.put<IResponse>(
      this.requestUrl + '/sign-up/edit-user',
      {
        ...payload,
      }
    );
  }

  public getEmployeeList(
    payload: Partial<IPagination>,
    inputValue?: string,
    fromDate?: string | null,
    toDate?: string | null
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.requestUrl + '/employee/list', {
      ...payload,
      employeeUserNameOrNameOrNic: inputValue,
      fromDate: fromDate,
      toDate: toDate,
    });
  }
}
