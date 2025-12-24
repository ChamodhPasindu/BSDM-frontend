import { Component, OnInit, ViewChild } from '@angular/core';
import {
  alertError,
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

@UntilDestroy()
@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit {
  @ViewChild('editViewStockModal') protected editViewStockModal!: EditViewStockComponent;
  @ViewChild('addStockModal') protected addStockModal!: AddStockComponent;

  protected readonly ActionButton = ActionButton;
  protected stockList: IStockData[];

  protected currentPage: number = 1;
  protected pageSize: number = 5;
  protected count: number = 0;

  protected searchForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly stockService: StockService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadStockTableData();
  }

  private createForm(): void {
    this.searchForm = this.fb.group({
      inputValue: [''],
      fromDate: [''],
      toDate: [''],
    });
  }

  protected onSubmit(): void {
    this.loadStockTableData();
  }

  protected onRefresh(): void {
    this.loadStockTableData();
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
        formattedToDate
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

  protected onClear(): void {
    this.searchForm.reset();
    this.loadStockTableData();
  }

  protected hasAnyValue(): boolean {
    const { inputValue, fromDate, toDate } = this.searchForm.value;

    return !!(inputValue || fromDate || toDate);
  }

  protected onDeleteStock(): void {
    // alertWarning(
    //   {
    //     title: RESPONSE_TITLES.WARNING,
    //     text: RESPONSE_MESSAGES.DELETE_CONFIRMATION,
    //   },
    //   (result: SweetAlertResult<any>) => {
    //     if (result.isConfirmed) {
    //       this.stockService
    //         .deleteProduct(id)
    //         .pipe(untilDestroyed(this))
    //         .subscribe({
    //           next: (res: IResponse) => {
    //             if (res.body.status === RSP_SUCCESS) {
    //               this.loadProductTableData();
    //               alertSuccess({
    //                 title: RESPONSE_TITLES.DONE,
    //                 text:
    //                   res.body.message ||
    //                   RESPONSE_MESSAGES.PRODUCT_DELETE_SUCCESS,
    //               });
    //             } else {
    //               alertError({
    //                 title: RESPONSE_TITLES.FAILED,
    //                 text:
    //                   res.body.message || RESPONSE_MESSAGES.PRODUCT_GET_FAILED,
    //               });
    //             }
    //           },
    //           error: (err: HttpErrorResponse) => {
    //             errorMessageHandler(err);
    //           },
    //         });
    //     }
    //   }
    // );
  }
}
