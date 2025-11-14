import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  public isLoading: boolean;

  constructor() {
    this.isLoading = false;
  }

  public setLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
  }
}
