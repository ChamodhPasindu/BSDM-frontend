import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
      <div class="text-center mb-4">
        <h6 class="fw-bold">Select Customer Type</h6>
      </div>

      <div class="row w-100 gx-3">
        <div class="col-6">
          <button
            (click)="navigate('new')"
            class="btn btn-primary w-100 py-3 d-flex flex-column align-items-center justify-content-center"
            type="button"
          >
            <c-icon name="cil-user-follow" size="xl" class="mb-2"></c-icon>
            <span class="fw-semibold">New</span>
          </button>
        </div>

        <div class="col-6">
          <button
            (click)="navigate('existing')"
            class="btn btn-warning w-100 py-3 d-flex flex-column align-items-center justify-content-center"
            type="button"
          >
            <c-icon name="cil-user" size="xl" class="mb-2"></c-icon>
            <span class="fw-semibold">Existing</span>
          </button>
        </div>
      </div>
    </div>
  `,
  imports: [IconModule],
  standalone: true,
})
export class MyCustomComponent {

  constructor(private bottomSheetService: NgxBottomSheetService,private router:Router) {
  }

  protected navigate(context: string) {
    this.router.navigate(['/sales/post-login/', context]);
    this.bottomSheetService.close();
  }

}
