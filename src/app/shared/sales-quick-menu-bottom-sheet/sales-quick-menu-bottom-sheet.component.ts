import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';

@Component({
  selector: 'app-sales-quick-menu-bottom-sheet',
  templateUrl: './sales-quick-menu-bottom-sheet.component.html',
  styleUrls: ['./sales-quick-menu-bottom-sheet.component.scss'],
})
export class SalesQuickMenuBottomSheetComponent {
  constructor(
    private bottomSheetService: NgxBottomSheetService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  protected navigateToBill(context: string) {
    this.router.navigate(['/sales/post-login/bill'], {
      relativeTo: this.route,
      queryParams: { context: context },
    });
    this.bottomSheetService.close();
  }

  protected navigateToPayment() {
    this.router.navigate(['/sales/post-login/payment'], {
      relativeTo: this.route,
    });
    this.bottomSheetService.close();
  }
}
