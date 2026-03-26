import { Component, OnInit, ViewChild } from '@angular/core';
import {
  alertError,
  datePickerToDate,
  errorMessageHandler,
  numberSeparate,
} from 'src/app/utility/helper';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { IPagination } from 'src/app/interfaces/IPagination';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from 'src/app/interfaces/IResponse';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { HttpErrorResponse } from '@angular/common/http';
import { IPaymentData } from 'src/app/interfaces/IPaymentData';
import { EditViewPaymentComponent } from './edit-view-payment/edit-view-payment.component';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { BillStatus } from 'src/app/enums/BillStatus.enum';
import * as moment from 'moment';
import { PdfExportService } from 'src/app/services/general/pdf-export.service';
import { PaymentStatus } from 'src/app/utility/constants/other-constant';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { IEmployeeData } from 'src/app/interfaces/IEmployeeData';
import { UserRole } from 'src/app/enums/UserRole.enum';
import { ISalesmanContribution } from 'src/app/interfaces/ISalesmanContribution';
import { SESSION_DATA } from 'src/app/utility/constants/session-data';
import { StorageService } from 'src/app/services/storage.service';

@UntilDestroy()
@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {
  @ViewChild('editViewPaymentModal')
  private readonly editViewPaymentModal!: EditViewPaymentComponent;

  protected readonly UserRoles = UserRole;
  protected readonly userRole = this.storageService.get(SESSION_DATA.ROLE)!;

  protected readonly BillStatus = BillStatus;
  protected readonly ActionButton = ActionButton;

  protected readonly statusList: Record<string, string>[] = PaymentStatus;

  protected paymentList: IPaymentData[];

  protected currentPage: number = 1;
  protected pageSize: number = 5;
  protected count: number = 0;

  protected searchForm: FormGroup;
  protected contributionForm: FormGroup;

  protected driverList: IEmployeeData[];
  protected contributionData: ISalesmanContribution | null = null;
  protected contributionSearched: boolean = false;

  protected today = new Date();

  protected widgetData: any;
  protected periods: Record<string, 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR'> = {
    fullPayment: 'TODAY',
    partialPayment: 'TODAY',
    pendingPayment: 'TODAY',
    discount: 'TODAY',
  };

  protected routeSummaryChartData: any[] = [];
  protected salesmanSummaryChartData: any[] = [];

  protected routeChartPeriod: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR' = 'MONTH';
  protected employeeChartPeriod: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR' = 'MONTH';

  protected routePieChartData: any = { labels: [], datasets: [] };
  protected employeePieChartData: any = { labels: [], datasets: [] };

  protected chartOptions: any = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += 'LKR ' + numberSeparate(context.parsed);
            }
            return label;
          },
        },
      },
    },
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly paymentService: PaymentService,
    private readonly pdfExportService: PdfExportService,
    private readonly employeeService: EmployeeService,
    private readonly storageService: StorageService,
  ) {
    this.createForm();
    this.createContributionForm();
  }

  private createForm(): void {
    this.searchForm = this.fb.group({
      inputPaymentValue: [''],
      inputCustomerValue: [''],
      inputDriverValue: [''],
      status: ['ALL'],
      fromDate: [this.today],
      toDate: [this.today],
    });
  }

  private createContributionForm(): void {
    this.contributionForm = this.fb.group({
      employeeId: [null],
      fromDate: [this.today],
      toDate: [this.today],
    });
  }

  ngOnInit(): void {
    this.loadPaymentTableData();
    this.loadPaymentWidgetData();

    this.loadRouteSummaryChartData();
    this.loadSalesmanSummaryChartData();

    this.loadDriverListData();
  }

  private loadDriverListData(): void {
    this.employeeService
      .getEmployeeList({ pageable: false })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.driverList =
              res.body.content.filter(
                (x: IEmployeeData) => x.roleCode === UserRole.SALESMAN,
              ) || [];
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.EMPLOYEE_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  protected onContributionSearch(): void {
    const { employeeId, fromDate, toDate } = this.contributionForm.value;

    if (!employeeId) {
      alertError({
        title: RESPONSE_TITLES.FAILED,
        text: 'Please select a driver.',
      });
      return;
    }

    const formattedFromDate = fromDate ? datePickerToDate(fromDate) : '';
    const formattedToDate = toDate ? datePickerToDate(toDate) : '';

    this.paymentService
      .getSalesmanContribution(employeeId, formattedFromDate, formattedToDate)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          this.contributionSearched = true;
          if (res.body.status === RSP_SUCCESS) {
            this.contributionData = res.body.content || null;
          } else {
            this.contributionData = null;
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.SALESMAN_SUMMARY_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          this.contributionData = null;
          this.contributionSearched = true;
          errorMessageHandler(err);
        },
      });
  }

  private loadRouteSummaryChartData(): void {
    this.paymentService
      .getRouteSummary()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.routeSummaryChartData =
              res.body.content?.routeTotalBillAmount || [];
            this.updateRoutePieChart();
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message || RESPONSE_MESSAGES.ROUTE_SUMMARY_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private loadSalesmanSummaryChartData(): void {
    this.paymentService
      .getSalesmanSummary()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.salesmanSummaryChartData =
              res.body.content?.employeeTotalBillAmount || [];
            this.updateEmployeePieChart();
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.SALESMAN_SUMMARY_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  protected onSubmit(): void {
    this.loadPaymentTableData();
  }

  protected onRefresh(): void {
    this.loadPaymentTableData();
    this.loadPaymentWidgetData();
  }

  private loadPaymentTableData(): void {
    const {
      inputPaymentValue,
      inputCustomerValue,
      inputDriverValue,
      status,
      fromDate,
      toDate,
    } = this.searchForm.value;

    let formattedFromDate = null;
    let formattedToDate = null;
    if (fromDate) {
      formattedFromDate = datePickerToDate(fromDate);
    }

    if (toDate) {
      formattedToDate = datePickerToDate(toDate);
    }

    const paginationRequest: IPagination = {
      pageable: true,
      page: this.currentPage - 1,
      size: this.pageSize,
    };

    this.paymentService
      .getPaymentList(
        paginationRequest,
        inputPaymentValue,
        inputCustomerValue,
        inputDriverValue,
        status,
        formattedFromDate,
        formattedToDate,
      )
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.paymentList = res.body.content.content || [];
            this.count = res.body.content.totalElements || 0;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.PAYMENT_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private loadPaymentWidgetData(): void {
    this.paymentService
      .getPaymentWidget()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.widgetData = res.body.content;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message || RESPONSE_MESSAGES.PAYMENT_WIDGET_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  protected setPeriod(
    card: string,
    period: 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR',
  ): void {
    this.periods[card] = period;
  }

  protected getFullPaymentReceived(): number {
    return (
      this.widgetData?.fullPaymentSummary?.find(
        (x: Record<string, string>) =>
          x['timePeriod'] === this.periods['fullPayment'],
      )?.totalAmount || 0
    );
  }

  protected getPartalPaymentReceived(): number {
    return (
      this.widgetData?.partialPaymentSummary?.find(
        (x: Record<string, string>) =>
          x['timePeriod'] === this.periods['partialPayment'],
      )?.totalAmount || 0
    );
  }

  protected getPendingTotalAmount(): number {
    return (
      this.widgetData?.pendingPaymentSummary?.find(
        (x: Record<string, string>) =>
          x['timePeriod'] === this.periods['pendingPayment'],
      )?.totalAmount || 0
    );
  }

  protected getDiscountTotalAmount(): number {
    return (
      this.widgetData?.discountSummary?.find(
        (x: Record<string, string>) =>
          x['timePeriod'] === this.periods['discount'],
      )?.totalAmount || 0
    );
  }

  protected goToPage(page: number): void {
    this.currentPage = page;
    this.loadPaymentTableData();
  }

  protected onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadPaymentTableData();
  }

  protected openEditViewPaymentModal(
    action: ActionButton,
    payment?: IPaymentData,
  ): void {
    this.editViewPaymentModal.action = action;
    this.editViewPaymentModal.payment = payment;
    this.editViewPaymentModal.loadData();
    this.editViewPaymentModal.visible = true;
  }

  protected onExport(): void {
    if (!this.paymentList || this.paymentList.length === 0) {
      alertError({
        title: RESPONSE_TITLES.FAILED,
        text: RESPONSE_MESSAGES.PAYMENT_EXPORT_FAILED,
      });
      return;
    }

    const columns = [
      { header: 'Order ID', width: 0.06 },
      { header: 'Customer', width: 0.18 },
      { header: 'Driver', width: 0.18 },
      { header: 'Paid Amount (LKR)', width: 0.2 },
      { header: 'Type', width: 0.1 },
      { header: 'Date', width: 0.1 },
      { header: 'Status', width: 0.16 },
    ];

    const data = this.paymentList.map((payment) => [
      payment.orderId.toString(),
      payment.customerName || '',
      payment.employeeName || '',
      payment.paidAmount || '',
      payment.paymentType || '',
      payment.paymentDate
        ? moment(payment.paymentDate).format('YYYY-MM-DD')
        : '',
      payment.orderPaymentStatus === BillStatus.FULL_PAYMENT
        ? 'Full Payment'
        : 'Partial Payment',
    ]);

    this.pdfExportService.exportToPdf({
      title: 'Payment Report',
      columns: columns,
      data: data,
      filename: `Payment_Report_${moment().format('YYYY-MM-DD_HH-mm-ss')}.pdf`,
      companyName: 'Visco Bakehouse Sales Delivery Monitoring System',
      mobileNumber: '+94 (0) 123 456 789',
      orientation: 'landscape',
    });
  }

  protected onSearchFormClear(): void {
    this.searchForm.reset({
      status: 'ALL',
      fromDate: this.today,
      toDate: this.today,
    });
    this.loadPaymentTableData();
  }

  protected onContributionFormClear(): void {
    this.contributionForm.reset({
      employeeId: null,
      fromDate: this.today,
      toDate: this.today,
    });
    this.contributionSearched = false;
    this.contributionData = null;
  }

  protected hasAnyContributionFormValue(): boolean {
    const { employeeId, fromDate, toDate } = this.contributionForm.value;

    return !!(employeeId || fromDate || toDate);
  }

  protected hasAnySearchFormValue(): boolean {
    const {
      inputPaymentValue,
      inputCustomerValue,
      inputDriverValue,
      status,
      fromDate,
      toDate,
    } = this.searchForm.value;

    return !!(
      inputPaymentValue ||
      inputCustomerValue ||
      inputDriverValue ||
      status ||
      fromDate ||
      toDate
    );
  }

  private generateColors(count: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * 200 + 55);
      const g = Math.floor(Math.random() * 200 + 55);
      const b = Math.floor(Math.random() * 200 + 55);
      colors.push(`rgb(${r}, ${g}, ${b})`);
    }
    return colors;
  }

  protected updateRoutePieChart(): void {
    const labels: string[] = [];
    const data: number[] = [];

    this.routeSummaryChartData.forEach((routeData: any) => {
      const matchingSale = routeData.sales?.find(
        (s: any) => s.period === this.routeChartPeriod,
      );
      const amount = matchingSale ? matchingSale.totalAmount : 0;
      labels.push(routeData.routeName || 'Unknown Route');
      data.push(amount);
    });

    const colors = this.generateColors(data.length);

    this.routePieChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          hoverBackgroundColor: colors,
        },
      ],
    };
  }

  protected updateEmployeePieChart(): void {
    const labels: string[] = [];
    const data: number[] = [];

    this.salesmanSummaryChartData.forEach((employeeData: any) => {
      const matchingSale = employeeData.sales?.find(
        (s: any) => s.period === this.employeeChartPeriod,
      );

      const amount = matchingSale ? matchingSale.totalAmount : 0;
      labels.push(employeeData.salesManName || 'Unknown Employee');
      data.push(amount);
    });

    const colors = this.generateColors(data.length);

    this.employeePieChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          hoverBackgroundColor: colors,
        },
      ],
    };
  }
}
