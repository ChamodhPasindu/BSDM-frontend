import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { BaseBottomSheetDirective } from 'src/app/utility/directives/base-bottom-sheet.directive';

@Component({
  selector: 'app-sales-quick-menu-bottom-sheet',
  templateUrl: './sales-quick-menu-bottom-sheet.component.html',
  styleUrls: ['./sales-quick-menu-bottom-sheet.component.scss'],
})
export class SalesQuickMenuBottomSheetComponent extends BaseBottomSheetDirective {
  constructor(
    public override bottomSheetService: NgxBottomSheetService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    super(bottomSheetService);
  }

  protected navigateToBill(type: string) {
    this.router.navigate(['/sales/post-login/bill'], {
      relativeTo: this.route,
      queryParams: { type: type },
    });
    this.bottomSheetService.close();
  }

  protected navigateToPayment() {
    this.router.navigate(['/sales/post-login/payment'], {
      relativeTo: this.route,
    });
    this.bottomSheetService.close();
  }

  protected navigateToEasyOrder() {
    this.router.navigate(['/sales/post-login/easy-order'], {
      relativeTo: this.route,
    });
    this.bottomSheetService.close();
  }
}
