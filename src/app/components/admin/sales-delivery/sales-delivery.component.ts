import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { BillStatus } from 'src/app/enums/BillStatus.enum';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IResponse } from 'src/app/interfaces/IResponse';
import { ISaleData } from 'src/app/interfaces/ISaleData';
import { ISaleItemData } from 'src/app/interfaces/ISaleItemData';
import { PdfExportService } from 'src/app/services/general/pdf-export.service';
import { SaleService } from 'src/app/services/sale/sale.service';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import {
  alertError,
  datePickerToDate,
  errorMessageHandler,
} from 'src/app/utility/helper';
import { ViewSaleComponent } from './view-sale/view-sale.component';
import { ViewSaleItemComponent } from './view-sale-item/view-sale-item.component';
import * as moment from 'moment';

@UntilDestroy()
@Component({
  selector: 'app-sales-delivery',
  templateUrl: './sales-delivery.component.html',
  styleUrls: ['./sales-delivery.component.scss'],
})
export class SalesDeliveryComponent implements OnInit {
  @ViewChild('viewSaleModal')
  private readonly viewSaleModal!: ViewSaleComponent;

  @ViewChild('viewSaleItemModal')
  private readonly viewSaleItemModal!: ViewSaleItemComponent;

  protected readonly statusList: Record<string, string>[] = [
    { code: 'ALL', description: 'All' },
    { code: 'DRAFT', description: 'Draft' },
    { code: 'IN_PROGRESS', description: 'In Progress' },
    { code: 'COMPLETED', description: 'Completed' },
    { code: 'CANCELLED', description: 'Cancelled' },
    { code: 'EXPIRED', description: 'Expired' },
    { code: 'DELIVERED', description: 'Delivered' },
  ];

  protected readonly BillStatus = BillStatus;

  protected readonly ActionButton = ActionButton;

  protected saleList: ISaleData[];
  protected saleItemList: ISaleItemData[];

  protected currentSalePage = 1;
  protected currentSaleItemPage = 1;

  protected salePageSize = 5;
  protected saleItemPageSize = 5;

  protected saleCount: number = 0;
  protected saleItemCount: number = 0;

  protected searchSaleForm: FormGroup;
  protected searchSaleItemForm: FormGroup;

  protected today = new Date();

  protected widgetData: any;
  protected periods: Record<string, 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR'> = {
    sales: 'TODAY',
    delivery: 'TODAY',
    pending: 'TODAY',
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly saleService: SaleService,
    private readonly pdfExportService: PdfExportService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadSaleTableData();
    this.loadSaleItemTableData();
    this.loadSaleDeliveryWidgetData();
  }

  private createForm(): void {
    this.searchSaleForm = this.fb.group({
      inputOrderValue: [''],
      inputCustomerValue: [''],
      inputDriverValue: [''],
      status: ['ALL'],
      fromDate: [this.today],
      toDate: [this.today],
    });

    this.searchSaleItemForm = this.fb.group({
      inputValue: [''],
      fromDate: [this.today],
      toDate: [this.today],
    });
  }

  private loadSaleTableData(): void {
    const {
      inputOrderValue,
      inputCustomerValue,
      inputDriverValue,
      status,
      fromDate,
      toDate,
    } = this.searchSaleForm.value;

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
      page: this.currentSalePage - 1,
      size: this.salePageSize,
    };

    this.saleService
      .getSaleList(
        paginationRequest,
        inputOrderValue,
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
            this.saleList = res.body.content.content || [];
            this.saleCount = res.body.content.totalElements || 0;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.SALE_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private loadSaleItemTableData(): void {
    const { inputValue, fromDate, toDate } = this.searchSaleItemForm.value;

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
      page: this.currentSaleItemPage - 1,
      size: this.saleItemPageSize,
    };

    this.saleService
      .getSaleItemList(
        paginationRequest,
        inputValue || '',
        formattedFromDate,
        formattedToDate,
      )
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.saleItemList = res.body.content.content || [];
            this.saleItemCount = res.body.content.totalElements || 0;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.SALE_ITEM_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private loadSaleDeliveryWidgetData(): void {
    this.saleService
      .getSaleDeliveryWidget()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.widgetData = res.body.content;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.SALE_DELIVERY_WIDGET_GET_FAILED,
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

  protected getSalesValue(): string {
    return (
      this.widgetData?.salesValueSummary?.find(
        (x: Record<string, string>) => x['period'] === this.periods['sales'],
      )?.totalValue ?? 0
    );
  }

  protected getDeliveryCount(): number {
    return (
      this.widgetData?.deliverySummary?.find(
        (x: Record<string, string>) => x['period'] === this.periods['delivery'],
      )?.count || 0
    );
  }

  protected getDeliveryTotalValue(): number {
    return (
      this.widgetData?.deliverySummary?.find(
        (x: Record<string, string>) => x['period'] === this.periods['delivery'],
      )?.totalValue || 0
    );
  }

  protected getPendingDeliveryCount(): number {
    return (
      this.widgetData?.pendingDeliverySummary?.find(
        (x: Record<string, string>) => x['period'] === this.periods['pending'],
      )?.count || 0
    );
  }

  protected getPendingDeliveryTotalValue(): number {
    return (
      this.widgetData?.pendingDeliverySummary?.find(
        (x: any) => x.period === this.periods['pending'],
      )?.totalValue || 0
    );
  }

  protected onSaleSubmit(): void {
    this.loadSaleTableData();
  }

  protected onSaleItemSubmit(): void {
    this.loadSaleItemTableData();
  }

  protected onSaleRefresh(): void {
    this.loadSaleTableData();
    this.loadSaleDeliveryWidgetData();
  }

  protected onSaleItemRefresh(): void {
    this.loadSaleItemTableData();
    this.loadSaleDeliveryWidgetData();
  }

  protected goToSalePage(page: number): void {
    this.currentSalePage = page;
    this.loadSaleTableData();
  }

  protected goToSaleItemPage(page: number): void {
    this.currentSaleItemPage = page;
    this.loadSaleItemTableData();
  }

  protected onSalePageSizeChange(newSize: number): void {
    this.salePageSize = newSize;
    this.currentSalePage = 1;
    this.loadSaleTableData();
  }

  protected onSaleItemPageSizeChange(newSize: number): void {
    this.saleItemPageSize = newSize;
    this.currentSaleItemPage = 1;
    this.loadSaleItemTableData();
  }

  protected onSaleClear(): void {
    this.searchSaleForm.reset({
      fromDate: this.today,
      toDate: this.today,
      status: 'ALL',
    });
    this.loadSaleTableData();
  }

  protected onSaleItemClear(): void {
    this.searchSaleItemForm.reset({
      fromDate: this.today,
      toDate: this.today,
    });
    this.loadSaleItemTableData();
  }

  protected hasAnySaleValue(): boolean {
    const {
      inputOrderValue,
      inputCustomerValue,
      inputDriverValue,
      status,
      fromDate,
      toDate,
    } = this.searchSaleForm.value;
    return !!(
      inputOrderValue ||
      inputCustomerValue ||
      inputDriverValue ||
      status ||
      fromDate ||
      toDate
    );
  }

  protected hasAnySaleItemValue(): boolean {
    const { inputValue, fromDate, toDate } = this.searchSaleItemForm.value;

    return !!(inputValue || fromDate || toDate);
  }

  protected onSaleExport(): void {
    if (!this.saleList || this.saleList.length === 0) {
      alertError({
        title: RESPONSE_TITLES.FAILED,
        text: RESPONSE_MESSAGES.SALE_EXPORT_FAILED,
      });
      return;
    }

    const columns = [
      { header: 'Order ID', width: 0.07 },
      { header: 'Ref No', width: 0.15 },
      { header: 'Customer', width: 0.14 },
      { header: 'Route', width: 0.14 },
      { header: 'Driver', width: 0.12 },
      { header: 'Amount', width: 0.1 },
      { header: 'Date', width: 0.1 },
      { header: 'Payment Status', width: 0.1 },
      { header: 'Status', width: 0.08 },
    ];

    const data = this.saleList.map((sale) => [
      sale.orderId.toString(),
      sale.orderReferenceNumber || '',
      sale.customerName || '',
      sale.routeName || '',
      sale.employeeName || '',
      sale.totalAmount || '',
      sale.orderDate ? moment(sale.orderDate).format('YYYY-MM-DD') : '',
      sale.paymentStatus === BillStatus.FULL_PAYMENT
        ? 'Full Payment'
        : 'Partial Payment',
      sale.statusDescription || '',
    ]);

    this.pdfExportService.exportToPdf({
      title: 'Sale Report',
      columns: columns,
      data: data,
      filename: `Sale_Report_${moment().format('YYYY-MM-DD_HH-mm-ss')}.pdf`,
      companyName: 'Visco Bakehouse Sales Delivery Monitoring System',
      mobileNumber: '+94 (0) 123 456 789',
      orientation: 'landscape',
    });
  }

  protected onSaleItemExport(): void {
    if (!this.saleItemList || this.saleItemList.length === 0) {
      alertError({
        title: RESPONSE_TITLES.FAILED,
        text: RESPONSE_MESSAGES.SALE_ITEM_EXPORT_FAILED,
      });
      return;
    }

    const columns = [
      { header: 'Item ID', width: 0.15 },
      { header: 'Name', width: 0.35 },
      { header: 'Quantity Sold', width: 0.25 },
      { header: 'Sale Amount', width: 0.25 },
    ];

    const data = this.saleItemList.map((saleItem) => [
      saleItem.itemId.toString(),
      saleItem.itemName || '',
      saleItem.totalQuantitySold || '',
      saleItem.totalSalesAmount || '',
    ]);

    this.pdfExportService.exportToPdf({
      title: 'Sale Item Report',
      columns: columns,
      data: data,
      filename: `Sale_Item_Report_${moment().format('YYYY-MM-DD_HH-mm-ss')}.pdf`,
      companyName: 'Visco Bakehouse Sales Delivery Monitoring System',
      mobileNumber: '+94 (0) 123 456 789',
      orientation: 'landscape',
    });
  }

  protected openViewSaleModal(sale: ISaleData) {
    this.viewSaleModal.sale = sale;
    this.viewSaleModal.loadData();
    this.viewSaleModal.visible = true;
  }

  protected openViewSaleItemModal(saleItem: ISaleItemData) {
    this.viewSaleItemModal.saleItem = saleItem;
    this.viewSaleItemModal.loadData();
    this.viewSaleItemModal.visible = true;
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
