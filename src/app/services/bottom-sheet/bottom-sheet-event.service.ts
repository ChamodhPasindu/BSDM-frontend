import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BottomSheetEventService {
  private closed$ = new Subject<any>();

  emitClose(data?: any) {
    this.closed$.next(data);
  }

  onClose() {
    return this.closed$.asObservable();
  }
}
