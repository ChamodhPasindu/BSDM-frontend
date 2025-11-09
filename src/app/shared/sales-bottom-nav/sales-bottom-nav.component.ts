import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { IconModule } from '@coreui/icons-angular';
import { SalesQuickMenuBottomSheetComponent } from '../sales-quick-menu-bottom-sheet/sales-quick-menu-bottom-sheet.component';

@Component({
  selector: 'app-sales-bottom-nav',
  templateUrl: './sales-bottom-nav.component.html',
  styleUrls: ['./sales-bottom-nav.component.scss'],
})
export class SalesBottomNavComponent {
  constructor(private bottomSheetService: NgxBottomSheetService) {}

  showBottomSheet = false;

  protected toggleBottomSheet() {
    this.bottomSheetService.open(SalesQuickMenuBottomSheetComponent, {
      height: '185px',
      showCloseButton: false,
      backgroundColor: '#fff',
    });
  }
}