import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IResponse } from 'src/app/interfaces/IResponse';
import { IVehicle } from 'src/app/interfaces/IVehicle';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable()
export class VehicleService {
  private requestUrl = `${getEndpoint(SECURE)}/vehicle`;

  constructor(private readonly httpClient: HttpClient) {}

  public addVehicle(payload: IVehicle): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.requestUrl + '/add-vehicle', {
      ...payload,
    });
  }

  public updateVehicle(payload: IVehicle): Observable<IResponse> {
    return this.httpClient.put<IResponse>(this.requestUrl + '/adjust-vehicle', {
      ...payload,
    });
  }

  public deleteVehicle(vehicleId: number): Observable<IResponse> {
    return this.httpClient.delete<IResponse>(
      this.requestUrl + '/remove-vehicle',
      {
        body: {
          vehicleId: vehicleId,
        },
      }
    );
  }

  public getVehicleList(
    payload: Partial<IPagination>,
    inputValue?: string,
    fromDate?: string | null,
    toDate?: string | null
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.requestUrl + '/list', {
      ...payload,
      vehicleNumberOrCode: inputValue,
      fromDate: fromDate,
      toDate: toDate,
    });
  }
}
