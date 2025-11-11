import { Injectable } from '@angular/core';
import {
  Observable,
  distinctUntilChanged,
  fromEvent,
  mapTo,
  merge,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  get isOnlineChanges$(): Observable<boolean> {
    return merge(
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    ).pipe(distinctUntilChanged());
  }
}
