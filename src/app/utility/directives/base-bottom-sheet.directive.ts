import { Directive } from '@angular/core';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { App } from '@capacitor/app';

@Directive({
  selector: '[appBaseBottomSheet]',
})
export class BaseBottomSheetDirective {
  public popStateHandler = this.onPopState.bind(this);

  constructor(public bottomSheetService: NgxBottomSheetService) {
    // Web back button handling
    history.pushState(null, '');
    window.addEventListener('popstate', this.popStateHandler);

    // Mobile hardware back button
    App.addListener('backButton', () => {
      this.bottomSheetService.close();
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('popstate', this.popStateHandler);
  }

  public onPopState(): void {
    this.bottomSheetService.close();
  }
}
