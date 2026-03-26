import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
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
