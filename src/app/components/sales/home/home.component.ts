import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import * as moment from 'moment';
import { SalesPaymentSummaryBottomSheetComponent } from '../../shared/sales-payment-summary-bottom-sheet/sales-payment-summary-bottom-sheet.component';
import { ProductService } from 'src/app/services/product/product.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from 'src/app/interfaces/IResponse';
import { HttpErrorResponse } from '@angular/common/http';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import {
  alertError,
  alertSuccess,
  errorMessageHandler,
} from 'src/app/utility/helper';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import { StorageService } from 'src/app/services/storage.service';
import { SESSION_DATA } from 'src/app/utility/constants/session-data';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  protected greetingText: string;
  protected currentDateTime: string;
  protected greetingImage: string = 'assets/images/morning-greetings.png';
  protected intervalId: any;

  protected isDayStarted: boolean = false;

  protected totalCollapseVisible: boolean = false;
  protected billCollapseVisible = false;
  protected pendingCollapseVisible = false;
  protected stockLeftCollapseVisible = false;
  protected coveredShopCollapseVisible = false;

  constructor(
    private readonly bottomSheetService: NgxBottomSheetService,
    private readonly productService: ProductService,
    private readonly storageService: StorageService,
  ) {}

  ngOnInit(): void {
    this.isDayStarted =
      this.storageService.get(SESSION_DATA.DAY_STATUS) === 'true';

    this.updateGreeting();

    this.intervalId = setInterval(() => {
      this.updateGreeting();
    }, 60000);
  }

  private updateGreeting(): void {
    const now = moment();
    const hours = now.hour();

    // Determine greeting text and image
    if (hours >= 5 && hours < 12) {
      this.greetingText = 'Good Morning!';
      this.greetingImage = 'assets/images/morning-greetings.png';
    } else if (hours >= 12 && hours < 17) {
      this.greetingText = 'Good Afternoon!';
      this.greetingImage = 'assets/images/afternoon-greetings.png';
    } else if (hours >= 17 && hours < 21) {
      this.greetingText = 'Good Evening!';
      this.greetingImage = 'assets/images/evening-greetings.png';
    } else {
      this.greetingText = 'Good Night!';
      this.greetingImage = 'assets/images/night-greetings.png';
    }

    // Format date and time using moment.js
    this.currentDateTime = now.format('MMMM DD, YYYY | hh:mm A');
  }

  protected toggleDayStatus(event: boolean): void {
    this.productService
      .salesmanDayStart()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            alertSuccess({
              title: RESPONSE_TITLES.SUCCESS,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.SALES_MAN_STATUS_GET_FAILED,
            });
            this.storageService.set(SESSION_DATA.DAY_STATUS, String(event));
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.SALES_MAN_STATUS_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  protected toggleTotalCollapse(): void {
    this.totalCollapseVisible = !this.totalCollapseVisible;
  }

  protected toggleBillCollapse(): void {
    this.billCollapseVisible = !this.billCollapseVisible;
  }

  protected togglePendingCollapse(): void {
    this.pendingCollapseVisible = !this.pendingCollapseVisible;
  }

  protected toggleStockLeftCollapse(): void {
    this.stockLeftCollapseVisible = !this.stockLeftCollapseVisible;
  }

  protected toggleCoveredShopCollapse(): void {
    this.coveredShopCollapseVisible = !this.coveredShopCollapseVisible;
  }

  protected products = [
    { name: 'Sunlight Soap', description: '250g pack', quantity: 24 },
    { name: 'Lifebuoy Shampoo', description: '100ml bottle', quantity: 12 },
    { name: 'Anchor Milk Powder', description: '1kg pack', quantity: 8 },
    { name: 'Milo Drink', description: '200ml can', quantity: 15 },
  ];

  protected openLatestPayment(): void {
    this.bottomSheetService.open(SalesPaymentSummaryBottomSheetComponent, {
      height: 'top',
      backgroundColor: '#fff',
      showCloseButton: false,
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
