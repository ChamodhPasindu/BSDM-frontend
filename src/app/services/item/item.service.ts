import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IItem } from 'src/app/interfaces/IItem';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IResponse } from 'src/app/interfaces/IResponse';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable()
export class ItemService {
  private requestUrl = `${getEndpoint(SECURE)}/product`;

  constructor(private readonly httpClient: HttpClient) {}

  public addItem(payload: IItem): Observable<IResponse> {
    return this.httpClient.post<IResponse>(
      this.requestUrl + '/add-product-name',
      {
        ...payload,
      },
    );
  }

  public updateItem(payload: IItem): Observable<IResponse> {
    return this.httpClient.put<IResponse>(
      this.requestUrl + '/edit-product-name',
      {
        ...payload,
      },
    );
  }

  public deleteItem(itemId: number): Observable<IResponse> {
    return this.httpClient.delete<IResponse>(
      this.requestUrl + '/delete-product-name',
      {
        body: {
          nameId: itemId,
        },
      },
    );
  }

  public getItemList(
    payload: Partial<IPagination>,
    inputValue?: string,
    fromDate?: string | null,
    toDate?: string | null,
  ): Observable<IResponse> {
    return this.httpClient.post<IResponse>(this.requestUrl + '/name/list', {
      ...payload,
      productNameOrDescription: inputValue,
      fromDate: fromDate,
      toDate: toDate,
    });
  }

  public getItemWidget(): Observable<IResponse> {
    return this.httpClient.get<IResponse>(
      this.requestUrl + '/card-details/item',
      {},
    );
  }
}
