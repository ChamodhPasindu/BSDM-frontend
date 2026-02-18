import { Component } from '@angular/core';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { SalesQuickMenuBottomSheetComponent } from '../sales-quick-menu-bottom-sheet/sales-quick-menu-bottom-sheet.component';
import { StorageService } from 'src/app/services/storage.service';
import { SESSION_DATA } from 'src/app/utility/constants/session-data';
import { alertWarning } from 'src/app/utility/helper';
import { DayStatus } from 'src/app/enums/DayStatus.enum';

@Component({
  selector: 'app-sales-bottom-nav',
  templateUrl: './sales-bottom-nav.component.html',
  styleUrls: ['./sales-bottom-nav.component.scss'],
})
export class SalesBottomNavComponent {
  protected isDayStarted: boolean = false;

  constructor(
    private readonly bottomSheetService: NgxBottomSheetService,
    private readonly storageService: StorageService,
  ) {}

  protected toggleBottomSheet(): void {
    const dayStatus = this.storageService.get(SESSION_DATA.DAY_STATUS);

    if (dayStatus === DayStatus.IN_SELLING) {
      this.bottomSheetService.open(SalesQuickMenuBottomSheetComponent, {
        height: '210px',
        showCloseButton: true,
        backgroundColor: '#fff',
      });
    } else {
      alertWarning({
        title: 'Day Not Started',
        text: 'Please start your day to access the quick menu.',
        confirmButtonText: 'Okay',
        showCancelButton: false,
      });
    }
  }
}
