import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import * as moment from 'moment';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from 'src/app/interfaces/IResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { alertError, errorMessageHandler } from 'src/app/utility/helper';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { IRecentTxn } from 'src/app/interfaces/IRecentTxn';
import { IRecentOrder } from 'src/app/interfaces/IRecentOrder';
import { IPendingCard } from 'src/app/interfaces/IPendingCard';
import { StorageService } from 'src/app/services/storage.service';
import { SESSION_DATA } from 'src/app/utility/constants/session-data';
import { UserRole } from 'src/app/enums/UserRole.enum';

@UntilDestroy()
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  protected readonly UserRoles = UserRole;
  protected readonly userRole = this.storageService.get(SESSION_DATA.ROLE)!;

  protected greetingText: string;
  protected currentDateTime: string;
  protected intervalId: any;

  protected totalCards: Record<string, string> | null = null;
  protected recentTransactionList: IRecentTxn[] = [];
  protected recentOrderList: IRecentOrder[] = [];
  protected pendingCardData: IPendingCard | null = null;

  public mainChart: IChartProps = {};
  public doughnutChart: IChartProps = {};

  protected trafficPeriod: string = 'month';
  protected doughnutPeriod: string = 'MONTH';

  private bestSellingRawData: {
    name: string;
    periods: { period: string; count: number }[];
  }[] = [];

  private salesGrowthRawData: { label: string; amount: number }[] = [];

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly chartsData: DashboardChartsData,
    private readonly storageService: StorageService,
  ) {}

  ngOnInit(): void {
    this.updateGreeting();

    this.intervalId = setInterval(() => {
      this.updateGreeting();
    }, 60000);

    this.initCharts();

    this.loadMainCardData();
    this.loadPendingCardData();
    this.loadRecentTransaction();
    this.loadRecentOrders();
    this.loadBestSellingProducts();
    this.loadSalesGrowth();
  }

  private initCharts(): void {
    this.mainChart = this.chartsData.mainChart;
    this.doughnutChart = this.chartsData.doughnutChart;
  }

  private updateGreeting(): void {
    const now = moment();
    const hours = now.hour();

    // Determine greeting text and image
    if (hours >= 5 && hours < 12) {
      this.greetingText = 'Good Morning!';
    } else if (hours >= 12 && hours < 17) {
      this.greetingText = 'Good Afternoon!';
    } else if (hours >= 17 && hours < 21) {
      this.greetingText = 'Good Evening!';
    } else {
      this.greetingText = 'Good Night!';
    }

    // Format date and time using moment.js
    this.currentDateTime = now.format('MMMM DD, YYYY | hh:mm A');
  }

  private loadMainCardData(): void {
    this.dashboardService
      .getAdminTotalCards()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.totalCards = res.body.content;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.ADMIN_DASHBOARD_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private loadPendingCardData(): void {
    this.dashboardService
      .getPeningCard()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.pendingCardData = res.body.content;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.ADMIN_DASHBOARD_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private loadRecentTransaction(): void {
    this.dashboardService
      .getRecentTransaction()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.recentTransactionList = res.body.content?.recentTransactions;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.ADMIN_DASHBOARD_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private loadRecentOrders(): void {
    this.dashboardService
      .getRecentOrders()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.recentOrderList = res.body.content?.recentOrders;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.ADMIN_DASHBOARD_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private loadBestSellingProducts(): void {
    this.dashboardService
      .getBestSellingProducts()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.bestSellingRawData =
              res.body.content?.bestSellingProducts ?? [];
            this.updateDoughnutChart();
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.ADMIN_DASHBOARD_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private loadSalesGrowth(period: string = 'month'): void {
    this.dashboardService
      .getSalesGrowth(period)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.salesGrowthRawData = res.body.content?.salesGrowthData ?? [];
            this.updateMainChart();
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.ADMIN_DASHBOARD_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private updateMainChart(): void {
    const labels = this.salesGrowthRawData.map((d) => d.label);
    const amounts = this.salesGrowthRawData.map((d) => d.amount);

    this.mainChart.data = {
      ...this.mainChart.data,
      labels,
      datasets: this.mainChart.data.datasets.map((ds: any, index: number) =>
        index === 0 ? { ...ds, data: amounts } : ds,
      ),
    };
  }

  private updateDoughnutChart(): void {
    const labels = this.bestSellingRawData.map((p) => p.name);
    const data = this.bestSellingRawData.map(
      (p) =>
        p.periods.find((x) => x.period === this.doughnutPeriod)?.count ?? 0,
    );
    const backgroundColor = this.chartsData.generateColors(data.length);

    this.doughnutChart.data = {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderWidth: 0,
        },
      ],
    };
  }

  protected setTrafficPeriod(value: string): void {
    this.trafficPeriod = value;
    this.loadSalesGrowth(value);
  }

  protected setBestSellingPeriod(value: string): void {
    this.doughnutPeriod = value;
    this.updateDoughnutChart();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
