import { Component, OnInit, ViewChild } from '@angular/core';
import {
  alertError,
  alertSuccess,
  alertWarning,
  datePickerToDate,
  errorMessageHandler,
} from 'src/app/utility/helper';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StockService } from 'src/app/services/stock/stock.service';
import { IPagination } from 'src/app/interfaces/IPagination';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from 'src/app/interfaces/IResponse';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { HttpErrorResponse } from '@angular/common/http';
import { IStockData } from 'src/app/interfaces/IStockData';
import { AddStockComponent } from './add-stock/add-stock.component';
import { EditViewStockComponent } from './edit-view-stock/edit-view-stock.component';
import * as moment from 'moment';
import { PdfExportService } from 'src/app/services/general/pdf-export.service';
import Swal from 'sweetalert2';

@UntilDestroy()
@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit {
  @ViewChild('editViewStockModal')
  private readonly editViewStockModal!: EditViewStockComponent;
  @ViewChild('addStockModal')
  private readonly addStockModal!: AddStockComponent;

  protected readonly ActionButton = ActionButton;
  protected stockList: IStockData[];

  protected currentPage: number = 1;
  protected pageSize: number = 5;
  protected count: number = 0;

  protected totalCount: number = 0;
  protected expiringCount: number = 0;
  protected expiredCount: number = 0;
  protected freshCount: number = 0;

  protected searchForm: FormGroup;
  protected today = new Date();

  constructor(
    private readonly fb: FormBuilder,
    private readonly stockService: StockService,
    private readonly pdfExportService: PdfExportService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadStockTableData();
    this.loadStockWidgetData();
  }

  private createForm(): void {
    this.searchForm = this.fb.group({
      inputValue: [''],
      fromDate: [this.today],
      toDate: [this.today],
    });
  }

  protected onSubmit(): void {
    this.loadStockTableData();
  }

  protected onRefresh(): void {
    this.loadStockTableData();
    this.loadStockWidgetData();
  }

  private loadStockTableData(): void {
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

    this.stockService
      .getStockList(
        paginationRequest,
        inputValue || '',
        formattedFromDate,
        formattedToDate,
      )
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.stockList = res.body.content.content || [];
            this.count = res.body.content.totalElements || 0;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.STOCK_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private loadStockWidgetData(): void {
    this.stockService
      .getStockWidget()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.totalCount = res.body.content?.totalStockCount || 0;

            this.expiringCount =
              res.body.content.stockExpiryStatusList?.find(
                (x: Record<string, string>) =>
                  x['statusDescription'] === 'EXPIRING_SOON',
              )?.count || 0;

            this.expiredCount =
              res.body.content.stockExpiryStatusList?.find(
                (x: Record<string, string>) =>
                  x['statusDescription'] === 'EXPIRED',
              )?.count || 0;

            this.freshCount =
              res.body.content.stockExpiryStatusList?.find(
                (x: Record<string, string>) =>
                  x['statusDescription'] === 'FRESH',
              )?.count || 0;
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

  protected goToPage(page: number): void {
    this.currentPage = page;
    this.loadStockTableData();
  }

  protected onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadStockTableData();
  }

  protected openAddStockView() {
    this.addStockModal.loadData();
    this.addStockModal.visible = true;
  }

  protected openStockView(action: ActionButton, stock?: IStockData) {
    this.editViewStockModal.action = action;
    this.editViewStockModal.stock = stock;
    this.editViewStockModal.visible = true;
  }

  protected onExport(): void {
    if (!this.stockList || this.stockList.length === 0) {
      alertError({
        title: RESPONSE_TITLES.FAILED,
        text: RESPONSE_MESSAGES.STOCK_EXPORT_FAILED,
      });
      return;
    }

    const columns = [
      { header: 'ID', width: 0.12 },
      { header: 'Product Name', width: 0.28 },
      { header: 'Total Quantity', width: 0.15 },
      { header: 'Remaining Quantity', width: 0.17 },
      { header: 'Sales Quantity', width: 0.12 },
      { header: 'Last Updated', width: 0.16 },
    ];

    const data = this.stockList.map((stock) => [
      stock.stockId || '',
      stock.productName || '',
      stock.totalQuantity || '',
      stock.remainingQuantity || '',
      stock.salesQuantity || '',
      stock.lastUpdated ? moment(stock.lastUpdated).format('YYYY-MM-DD') : '',
    ]);

    this.pdfExportService.exportToPdf({
      title: 'Stock Report',
      columns: columns,
      data: data,
      filename: `Stock_Report_${moment().format('YYYY-MM-DD_HH-mm-ss')}.pdf`,
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
    this.loadStockTableData();
  }

  protected hasAnyValue(): boolean {
    const { inputValue, fromDate, toDate } = this.searchForm.value;

    return !!(inputValue || fromDate || toDate);
  }

  // protected onDeleteStock(product: IStockData): void {
  //   Swal.fire({
  //     title: RESPONSE_TITLES.WARNING,
  //     html:
  //       `<div class="text-start">
  //         <label class="form-label fw-semibold" for="swal-qty">Quantity to remove</label>
  //         <input id="swal-qty" type="number" min="1" max="${product.totalQuantity}" class="form-control mb-2" placeholder="Enter quantity" />
  //         <small class="text-muted d-block mb-3">Max: ${product.totalQuantity}</small>
  //         <label class="form-label fw-semibold" for="swal-reason">Reason</label>
  //         <input id="swal-reason" type="text" class="form-control" placeholder="Enter reason" />
  //       </div>`,
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Remove',
  //     cancelButtonText: 'Cancel',
  //     reverseButtons: true,
  //     allowOutsideClick: false,
  //     customClass: {
  //       popup: 'coreui-popup',
  //       confirmButton: 'btn btn-danger ms-2',
  //       cancelButton: 'btn btn-secondary',
  //     },
  //     preConfirm: () => {
  //       const qtyInput = document.getElementById('swal-qty') as HTMLInputElement;
  //       const reasonInput = document.getElementById('swal-reason') as HTMLInputElement;

  //       const quantity = Number(qtyInput?.value);
  //       const reason = reasonInput?.value?.trim();

  //       if (!quantity || isNaN(quantity) || quantity <= 0) {
  //         Swal.showValidationMessage('Please enter a valid quantity.');
  //         return;
  //       }

  //       if (quantity > product.totalQuantity) {
  //         Swal.showValidationMessage(`Quantity cannot exceed ${product.totalQuantity}.`);
  //         return;
  //       }

  //       if (!reason) {
  //         Swal.showValidationMessage('Please enter a reason.');
  //         return;
  //       }

  //       return { quantity, reason };
  //     },
  //   }).then((result) => {
  //     if (!result.isConfirmed || !result.value) return;

  //     const { quantity, reason } = result.value as {
  //       quantity: number;
  //       reason: string;
  //     };

  //     this.stockService
  //       .deleteStock(product.productId, quantity, reason)
  //       .pipe(untilDestroyed(this))
  //       .subscribe({
  //         next: (res: IResponse) => {
  //           if (res.body.status === RSP_SUCCESS) {
  //             this.loadStockTableData();
  //             alertSuccess({
  //               title: RESPONSE_TITLES.DONE,
  //               text:
  //                 res.body.message || RESPONSE_MESSAGES.STOCK_DELETE_SUCCESS,
  //             });
  //           } else {
  //             alertError({
  //               title: RESPONSE_TITLES.FAILED,
  //               text:
  //                 res.body.message || RESPONSE_MESSAGES.STOCK_DELETE_FAILED,
  //             });
  //           }
  //         },
  //         error: (err: HttpErrorResponse) => {
  //           errorMessageHandler(err);
  //         },
  //       });
  //   });
  // }
}
