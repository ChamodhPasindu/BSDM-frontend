import { Component, OnInit, ViewChild } from '@angular/core';
import {
  alertError,
  datePickerToDate,
  errorMessageHandler,
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

const DATA_COUNT = 5;
const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };

@UntilDestroy()
@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {
  @ViewChild('editViewPaymentModal')
  protected editViewPaymentModal!: EditViewPaymentComponent;

  protected readonly statusList: Record<string, string>[] = [
    { code: 'ALL', description: 'All' },
    { code: 'PARTIAL_PAYMENT', description: 'Partial payment' },
    { code: 'FULL_PAYMENT', description: 'Full Payment' },
  ];

  protected readonly ActionButton = ActionButton;
  protected paymentList: IPaymentData[];

  protected currentPage: number = 1;
  protected pageSize: number = 5;
  protected count: number = 0;

  protected searchForm: FormGroup;

  protected today = new Date();

  constructor(
    private readonly fb: FormBuilder,
    private readonly paymentService: PaymentService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadPaymentTableData();
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

  protected onSubmit(): void {
    this.loadPaymentTableData();
  }

  protected onRefresh(): void {
    this.loadPaymentTableData();
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

  protected goToPage(page: number): void {
    this.currentPage = page;
    this.loadPaymentTableData();
  }

  protected onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadPaymentTableData();
  }

  protected openEditViewPaymentModal(action: ActionButton, payment?: any) {
    this.editViewPaymentModal.action = action;
    this.editViewPaymentModal.payment = payment;
    this.editViewPaymentModal.loadData();
    this.editViewPaymentModal.visible = true;
  }

  protected onClear(): void {
    this.searchForm.reset({
      status: 'ALL',
      fromDate: this.today,
      toDate: this.today,
    });
    this.loadPaymentTableData();
  }

  protected hasAnyValue(): boolean {
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

  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
  };

  chartLineData = {
    labels: [...this.months].slice(0, 7),
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'rgba(220, 220, 220, 0.2)',
        borderColor: 'rgba(220, 220, 220, 1)',
        pointBackgroundColor: 'rgba(220, 220, 220, 1)',
        pointBorderColor: '#fff',
        data: [
          this.randomData,
          this.randomData,
          this.randomData,
          this.randomData,
          this.randomData,
          this.randomData,
          this.randomData,
        ],
      },
      {
        label: 'My Second dataset',
        backgroundColor: 'rgba(151, 187, 205, 0.2)',
        borderColor: 'rgba(151, 187, 205, 1)',
        pointBackgroundColor: 'rgba(151, 187, 205, 1)',
        pointBorderColor: '#fff',
        data: [
          this.randomData,
          this.randomData,
          this.randomData,
          this.randomData,
          this.randomData,
          this.randomData,
          this.randomData,
        ],
      },
    ],
  };

  chartBarData = {
    labels: [...this.months].slice(0, 7),
    datasets: [
      {
        label: 'GitHub Commits',
        backgroundColor: '#f87979',
        data: [40, 20, 12, 39, 17, 42, 79],
      },
    ],
  };

  chartPieData = {
    labels: ['Red', 'Green', 'Yellow'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  get randomData() {
    return Math.round(Math.random() * 100);
  }
}
