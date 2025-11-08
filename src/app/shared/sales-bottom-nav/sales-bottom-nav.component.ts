import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { IconModule } from '@coreui/icons-angular';

@Component({
  selector: 'app-sales-bottom-nav',
  templateUrl: './sales-bottom-nav.component.html',
  styleUrls: ['./sales-bottom-nav.component.scss'],
})
export class SalesBottomNavComponent implements OnInit {
  constructor(
    private router: Router,
    private bottomSheetService: NgxBottomSheetService
  ) {}

  ngOnInit(): void {}

  showBottomSheet = false;

  toggleBottomSheet() {
    this.bottomSheetService.open(MyCustomComponent, {
      height: 'quarter',
      showCloseButton: true,
      backgroundColor: '#fff',
    });
  }
}

@Component({
  selector: 'app-my-custom-component',
  template: `
    <div
      class="d-flex flex-column justify-content-center align-items-center p-2"
    >
      <div class="text-center mb-3 mt-2">
        <h6 class="fw-bold">Quick Access Menu</h6>
      </div>

      <div class="row w-100 gx-3">
        <div class="col-4">
          <button
            (click)="navigateToBill('new')"
            class="btn btn-primary w-100 py-3 d-flex flex-column align-items-center justify-content-center"
            type="button"
          >
            <c-icon name="cil-user-follow" size="xl" class="mb-2"></c-icon>
            <span class="fw-semibold">New</span>
          </button>
        </div>

        <div class="col-4">
          <button
            (click)="navigateToBill('existing')"
            class="btn btn-warning w-100 py-3 d-flex flex-column align-items-center justify-content-center"
            type="button"
          >
            <c-icon name="cil-user" size="xl" class="mb-2"></c-icon>
            <span class="fw-semibold">Existing</span>
          </button>
        </div>

        <div class="col-4">
          <button
            (click)="navigateToPayment()"
            class="btn btn-dark w-100 py-3 d-flex flex-column align-items-center justify-content-center"
            type="button"
          >
            <c-icon name="cil-dollar" size="xl" class="mb-2"></c-icon>
            <span class="fw-semibold">Payment</span>
          </button>
        </div>
      </div>
    </div>
  `,
  imports: [IconModule],
  standalone: true,
})
export class MyCustomComponent {
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
