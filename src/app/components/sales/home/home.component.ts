import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
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
import { DayStatus } from 'src/app/enums/DayStatus.enum';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { ISalesmanDashboardData } from 'src/app/interfaces/ISalesmanDashboardData';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  protected readonly DayStatus = DayStatus;
  protected dayStatus: DayStatus;

  protected greetingText: string;
  protected currentDateTime: string;
  protected greetingImage: string = 'assets/images/morning-greetings.png';
  protected intervalId: any;

  protected totalCollapseVisible: boolean = false;
  protected billCollapseVisible = false;
  protected pendingCollapseVisible = false;

  protected dashboardData: ISalesmanDashboardData | undefined;
  protected routeCards: Record<string, string>[] = [];
  protected remainingProducts: Record<string, string>[] = [];
  protected metricsDetails: Record<string, string> | null = null;

  constructor(
    private readonly productService: ProductService,
    private readonly storageService: StorageService,
    private readonly dashboardService: DashboardService,
  ) {}

  ngOnInit(): void {
    this.updateGreeting();
    this.fetchDayStatus();

    this.loadMainCardData();
    this.loadRouteCards();
    this.loadRemainingProductDetails();
    this.loadMetricsDetails();

    this.intervalId = setInterval(() => {
      this.updateGreeting();
    }, 60000);
  }

  private fetchDayStatus(): void {
    this.productService
      .getSalesmanDayStatus()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.dayStatus = res.body.content.dayStatusCode;
            this.storageService.set(SESSION_DATA.DAY_STATUS, this.dayStatus);
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

  private loadMainCardData(): void {
    this.dashboardService
      .getSalesmanTotalCards()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.dashboardData = res.body.content;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.SALES_MAN_DASHBOARD_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  protected getSummaryValue(
    type: 'BILL' | 'PENDING',
    time: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR',
  ): number {
    const summary =
      type === 'BILL'
        ? this.dashboardData?.billSummary
        : this.dashboardData?.pendingSummary;
    return summary?.find((x) => x.time === time)?.valuesOfBills || 0;
  }

  protected getSummaryCount(
    type: 'BILL' | 'PENDING',
    time: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR',
  ): number {
    const summary =
      type === 'BILL'
        ? this.dashboardData?.billSummary
        : this.dashboardData?.pendingSummary;
    return summary?.find((x) => x.time === time)?.count || 0;
  }

  private loadRouteCards(): void {
    this.dashboardService
      .getRouteCards()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.routeCards = res.body.content;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.SALES_MAN_DASHBOARD_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private loadRemainingProductDetails(): void {
    this.dashboardService
      .getRemainingProductDetails()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.remainingProducts = res.body.content.lowStockProducts;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.SALES_MAN_DASHBOARD_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private loadMetricsDetails(): void {
    this.dashboardService
      .getMetricsDetails()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.metricsDetails = res.body.content;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.SALES_MAN_DASHBOARD_GET_FAILED,
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
            this.dayStatus = event ? DayStatus.IN_SELLING : DayStatus.LOADED;
            this.storageService.set(SESSION_DATA.DAY_STATUS, this.dayStatus);
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

  protected toggleBillCollapse(): void {
    this.billCollapseVisible = !this.billCollapseVisible;
  }

  protected togglePendingCollapse(): void {
    this.pendingCollapseVisible = !this.pendingCollapseVisible;
  }

  // protected openLatestPayment(): void {
  //   this.bottomSheetService.open(SalesPaymentSummaryBottomSheetComponent, {
  //     height: 'top',
  //     backgroundColor: '#fff',
  //     showCloseButton: false,
  //   });
  // }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
