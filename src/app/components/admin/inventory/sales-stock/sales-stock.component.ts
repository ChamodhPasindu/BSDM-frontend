import { Component, OnInit, ViewChild } from '@angular/core';
import { ViewSaleStockComponent } from './view-sale-stock/view-sale-stock.component';
import {
  alertError,
  alertWarning,
  datePickerToDate,
  errorMessageHandler,
  numberSeparate,
} from 'src/app/utility/helper';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from 'src/app/interfaces/IResponse';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import { HttpErrorResponse } from '@angular/common/http';
import { IPagination } from 'src/app/interfaces/IPagination';
import { SaleStockService } from 'src/app/services/sale-stock/sale-stock.service';
import { ISaleStockData } from 'src/app/interfaces/ISaleStockData';
import { AddSaleStockComponent } from './add-sale-stock/add-sale-stock.component';
import { PdfExportService } from 'src/app/services/general/pdf-export.service';
import * as moment from 'moment';

@UntilDestroy()
@Component({
  selector: 'app-sales-stock',
  templateUrl: './sales-stock.component.html',
  styleUrls: ['./sales-stock.component.scss'],
})
export class SalesStockComponent implements OnInit {
  @ViewChild('viewSaleStockModal')
  private readonly viewSaleStockModal!: ViewSaleStockComponent;
  @ViewChild('addSaleStockModal')
  private readonly addSaleStockModal!: AddSaleStockComponent;

  protected readonly ActionButton = ActionButton;
  protected saleStockList: ISaleStockData[];

  protected currentPage: number = 1;
  protected pageSize: number = 5;
  protected count: number = 0;

  protected searchForm: FormGroup;
  protected today = new Date();

  protected widgetData: any;
  protected periods: Record<string, 'TODAY' | 'WEEK' | 'MONTH'> = {
    product: 'TODAY',
    value: 'TODAY',
    employee: 'TODAY',
    vehicle: 'TODAY',
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly saleStockService: SaleStockService,
    private readonly pdfExportService: PdfExportService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadSaleStockTableData();
    this.loadSalesStockWidgetData();
  }

  private createForm(): void {
    this.searchForm = this.fb.group({
      inputValue: [''],
      fromDate: [this.today],
      toDate: [this.today],
    });
  }

  protected onSubmit(): void {
    this.loadSaleStockTableData();
  }

  protected onRefresh(): void {
    this.loadSaleStockTableData();
    this.loadSalesStockWidgetData();
  }

  private loadSaleStockTableData(): void {
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

    this.saleStockService
      .getSaleStockList(
        paginationRequest,
        inputValue || '',
        formattedFromDate,
        formattedToDate,
      )
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.saleStockList = res.body.content.content || [];
            this.count = res.body.content.totalElements || 0;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.SALE_STOCK_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private loadSalesStockWidgetData(): void {
    this.saleStockService
      .getSaleStockWidget()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.widgetData = res.body.content;
          } else {
            alertWarning({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.SALE_STOCK_WIDGET_GET_FAILED,
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

  protected getParsedStockValue(): string | number {
    const data = this.widgetData?.assignedValueCardList?.find(
      (x: any) => x.period === this.periods['value'],
    );
    if (!data) return 0;
    return `LKR ${numberSeparate(data.minValue)} (Min) \nLKR ${numberSeparate(
      data.maxValue,
    )} (Max)`;
  }

  protected getEmployeeCount(): number {
    return (
      this.widgetData?.assignedEmployeeCountList?.find(
        (x: any) => x.period === this.periods['employee'],
      )?.employeeCount || 0
    );
  }

  protected getProductCount(): number {
    return (
      this.widgetData?.assignedProductCountList?.find(
        (x: any) => x.period === this.periods['product'],
      )?.productCount || 0
    );
  }

  protected getVehicleCount(): number {
    return (
      this.widgetData?.assignedVehicleCountList?.find(
        (x: any) => x.period === this.periods['vehicle'],
      )?.vehicleCount || 0
    );
  }

  protected goToPage(page: number): void {
    this.currentPage = page;
    this.loadSaleStockTableData();
  }

  protected onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadSaleStockTableData();
  }

  protected openAddSaleStockView(): void {
    this.addSaleStockModal.loadData();
    this.addSaleStockModal.visible = true;
  }

  protected openSaleStockView(
    action: ActionButton,
    saleStock: ISaleStockData,
  ): void {
    this.viewSaleStockModal.action = action;
    this.viewSaleStockModal.saleStock = saleStock;
    this.viewSaleStockModal.loadData();
    this.viewSaleStockModal.visible = true;
  }

  protected onExport(): void {
    if (!this.saleStockList || this.saleStockList.length === 0) {
      alertError({
        title: RESPONSE_TITLES.FAILED,
        text: RESPONSE_MESSAGES.SALE_STOCK_EXPORT_FAILED,
      });
      return;
    }

    const columns = [
      { header: 'ID', width: 0.1 },
      { header: 'Vehicle No', width: 0.14 },
      { header: 'Driver Name', width: 0.2 },
      { header: 'Routes', width: 0.14 },
      { header: 'Load Date', width: 0.12 },
      { header: 'Created Date', width: 0.16 },
      { header: 'Status', width: 0.14 },
    ];

    const data = this.saleStockList.map((saleStock) => [
      saleStock.loadId || '',
      saleStock.vehicleNumber || '',
      saleStock.employeeFullName || '',
      saleStock.routeNames?.join(', ') || '',
      saleStock.loadDate || '',
      saleStock.createdAt
        ? moment(saleStock.createdAt).format('YYYY-MM-DD')
        : '',
      saleStock.statusDescription || '',
    ]);

    this.pdfExportService.exportToPdf({
      title: 'Sale Stock Report',
      columns: columns,
      data: data,
      filename: `Sale_Stock_Report_${moment().format('YYYY-MM-DD_HH-mm-ss')}.pdf`,
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
    this.loadSaleStockTableData();
  }

  protected hasAnyValue(): boolean {
    const { inputValue, fromDate, toDate } = this.searchForm.value;

    return !!(inputValue || fromDate || toDate);
  }

  // protected onDeleteSaleStock(id: number): void {
  //   alertWarning(
  //     {
  //       title: RESPONSE_TITLES.WARNING,
  //       text: RESPONSE_MESSAGES.DELETE_CONFIRMATION,
  //     },
  //     (result: SweetAlertResult<any>) => {
  //       if (result.isConfirmed) {
  //         this.saleStockService
  //           .deleteSaleStock(id)
  //           .pipe(untilDestroyed(this))
  //           .subscribe({
  //             next: (res: IResponse) => {
  //               if (res.body.status === RSP_SUCCESS) {
  //                 this.loadSaleStockTableData();
  //                 alertSuccess({
  //                   title: RESPONSE_TITLES.DONE,
  //                   text:
  //                     res.body.message ||
  //                     RESPONSE_MESSAGES.SALE_STOCK_DELETE_SUCCESS,
  //                 });
  //               } else {
  //                 alertError({
  //                   title: RESPONSE_TITLES.FAILED,
  //                   text:
  //                     res.body.message ||
  //                     RESPONSE_MESSAGES.SALE_STOCK_DELETE_FAILED,
  //                 });
  //               }
  //             },
  //             error: (err: HttpErrorResponse) => {
  //               errorMessageHandler(err);
  //             },
  //           });
  //       }
  //     }
  //   );
  // }
}
