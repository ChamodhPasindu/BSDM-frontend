import { Component } from '@angular/core';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { SalesQuickMenuBottomSheetComponent } from '../sales-quick-menu-bottom-sheet/sales-quick-menu-bottom-sheet.component';

@Component({
  selector: 'app-sales-bottom-nav',
  templateUrl: './sales-bottom-nav.component.html',
  styleUrls: ['./sales-bottom-nav.component.scss'],
})
export class SalesBottomNavComponent {
  constructor(private readonly bottomSheetService: NgxBottomSheetService) {}

  protected toggleBottomSheet() {
    this.bottomSheetService.open(SalesQuickMenuBottomSheetComponent, {
      height: '210px',
      showCloseButton: true,
      backgroundColor: '#fff',
    });
  }
}
