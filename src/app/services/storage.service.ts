import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SECURE, getEndpoint } from 'src/app/utility/common/end-point';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private requestUrl = `${getEndpoint(SECURE)}`;

  constructor(private readonly httpClient: HttpClient) {}

  public set(key: string, value: any): void {
    sessionStorage.setItem(window.btoa(key), window.btoa(value));
  }

  public get(key: string): string | null {
    const encodedValue = sessionStorage.getItem(window.btoa(key));
    return encodedValue ? window.atob(encodedValue) : null;
  }

  public clearSession(): void {
    sessionStorage.clear();
  }
}
