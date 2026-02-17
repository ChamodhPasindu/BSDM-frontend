import { Component, OnInit, ViewChild } from '@angular/core';
import { ViewReturnStockComponent } from './view-return-stock/view-return-stock.component';
import {
  alertError,
  alertWarning,
  datePickerToDate,
  errorMessageHandler,
} from 'src/app/utility/helper';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StockReturnService } from 'src/app/services/stock-return/stock-return.service';
import { IPagination } from 'src/app/interfaces/IPagination';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from 'src/app/interfaces/IResponse';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { HttpErrorResponse } from '@angular/common/http';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { AddReturnStockComponent } from './add-return-stock/add-return-stock.component';
import { IReturnStockData } from 'src/app/interfaces/IReturnStockData';
import { ReviewReturnStockComponent } from './review-return-stock/review-return-stock.component';
import { PdfExportService } from 'src/app/services/general/pdf-export.service';
import * as moment from 'moment';

@UntilDestroy()
@Component({
  selector: 'app-return-stock',
  templateUrl: './return-stock.component.html',
  styleUrls: ['./return-stock.component.scss'],
})
export class ReturnStockComponent implements OnInit {
  @ViewChild('viewReturnStockModal')
  private readonly viewReturnStockModal!: ViewReturnStockComponent;
  @ViewChild('addReturnStockModal')
  private readonly addReturnStockModal!: AddReturnStockComponent;
  @ViewChild('reviewReturnStockModal')
  private readonly reviewReturnStockModal!: ReviewReturnStockComponent;

  protected readonly ActionButton = ActionButton;
  protected returnStockList: IReturnStockData[];

  protected currentPage: number = 1;
  protected pageSize: number = 5;
  protected count: number = 0;

  protected searchForm: FormGroup;
  protected today = new Date();

  constructor(
    private readonly fb: FormBuilder,
    private readonly stockReturnService: StockReturnService,
    private readonly pdfExportService: PdfExportService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadReturnStockTableData();
    this.loadReturnStockWidgetData();
  }

  private createForm(): void {
    this.searchForm = this.fb.group({
      inputValue: [''],
      fromDate: [this.today],
      toDate: [this.today],
    });
  }

  protected onSubmit(): void {
    this.loadReturnStockTableData();
  }

  protected onRefresh(): void {
    this.loadReturnStockTableData();
    this.loadReturnStockWidgetData();
  }

  private loadReturnStockTableData(): void {
    const { inputValue, fromDate, toDate } = this.searchForm.value;

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

    this.stockReturnService
      .getReturnStockList(
        paginationRequest,
        inputValue || '',
        formattedFromDate,
        formattedToDate,
      )
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.returnStockList = res.body.content.content || [];
            this.count = res.body.content.totalElements || 0;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message || RESPONSE_MESSAGES.RETURN_STOCK_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  protected widgetData: any;
  protected periods: Record<string, 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR'> = {
    returnStock: 'TODAY',
    value: 'TODAY',
    employee: 'TODAY',
    vehicle: 'TODAY',
  };

  private loadReturnStockWidgetData(): void {
    this.stockReturnService
      .getReturnStockWidget()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.widgetData = res.body.content;
          } else {
            alertWarning({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message || RESPONSE_MESSAGES.STOCK_WIDGET_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  protected setPeriod(card: string, period: 'TODAY' | 'WEEK' | 'MONTH'): void {
    this.periods[card] = period;
  }

  protected getReturnValue(): string | number {
    const data = this.widgetData?.returnValueCardList?.find(
      (x: any) => x.period === this.periods['value'],
    );
    if (!data) return 0;
    return `LKR ${data.minValue} - ${data.maxValue}`;
  }

  protected getReturnEmployeeCount(): number {
    return (
      this.widgetData?.returnEmployeeCountList?.find(
        (x: any) => x.period === this.periods['employee'],
      )?.employeeCount || 0
    );
  }

  protected getReturnProductCount(): number {
    return (
      this.widgetData?.returnProductCountList?.find(
        (x: any) => x.period === this.periods['returnStock'],
      )?.productCount || 0
    );
  }

  protected goToPage(page: number): void {
    this.currentPage = page;
    this.loadReturnStockTableData();
  }

  protected onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadReturnStockTableData();
  }

  protected openAddReturnStockView(): void {
    this.addReturnStockModal.loadData();
    this.addReturnStockModal.visible = true;
  }

  protected openReviewReturnStockView(): void {
    this.reviewReturnStockModal.loadData();
    this.reviewReturnStockModal.visible = true;
  }

  protected openReturnStockView(
    action: ActionButton,
    returnStock: IReturnStockData,
  ): void {
    this.viewReturnStockModal.action = action;
    this.viewReturnStockModal.returnStock = returnStock;
    this.viewReturnStockModal.loadData();
    this.viewReturnStockModal.visible = true;
  }

  protected onExport(): void {
    if (!this.returnStockList || this.returnStockList.length === 0) {
      alertError({
        title: RESPONSE_TITLES.FAILED,
        text: RESPONSE_MESSAGES.RETURN_STOCK_EXPORT_FAILED,
      });
      return;
    }

    const columns = [
      { header: 'ID', width: 0.09 },
      { header: 'Load Date', width: 0.12 },
      { header: 'Return Date', width: 0.12 },
      { header: 'Driver', width: 0.17 },
      { header: 'Vehicle No', width: 0.1 },
      { header: 'Routes', width: 0.14 },
      { header: 'Created Date', width: 0.14 },
      { header: 'Status', width: 0.12 },
    ];

    const data = this.returnStockList.map((returnStock) => [
      returnStock.loadId || '',
      returnStock.loadDate || '',
      returnStock.returnDate || '',
      returnStock.employeeFullName || '',
      returnStock.vehicleNumber || '',
      returnStock.route?.map((route) => route.description).join(', ') || '',
      returnStock.createdAt
        ? moment(returnStock.createdAt).format('YYYY-MM-DD')
        : '',
      returnStock.statusDescription || '',
    ]);

    this.pdfExportService.exportToPdf({
      title: 'Return Stock Report',
      columns: columns,
      data: data,
      filename: `Return_Stock_Report_${moment().format('YYYY-MM-DD_HH-mm-ss')}.pdf`,
      companyName: 'Visco Bakehouse Sales Delivery Monitoring System',
      mobileNumber: '+94 (0) 123 456 789',
      orientation: 'landscape',
    });
  }

  protected onClear(): void {
    this.searchForm.reset({
      fromDate: this.today,
      toDate: this.today,
    });
    this.loadReturnStockTableData();
  }

  protected hasAnyValue(): boolean {
    const { inputValue, fromDate, toDate } = this.searchForm.value;

    return !!(inputValue || fromDate || toDate);
  }
}
