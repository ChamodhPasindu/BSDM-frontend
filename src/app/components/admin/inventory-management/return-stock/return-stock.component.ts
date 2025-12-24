import { Component, OnInit, ViewChild } from '@angular/core';
import { ViewReturnStockComponent } from './view-return-stock/view-return-stock.component';
import {
  alertError,
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

@UntilDestroy()
@Component({
  selector: 'app-return-stock',
  templateUrl: './return-stock.component.html',
  styleUrls: ['./return-stock.component.scss'],
})
export class ReturnStockComponent implements OnInit {
  @ViewChild('viewReturnStockModal')
  protected viewReturnStockModal!: ViewReturnStockComponent;
  @ViewChild('addReturnStockModal')
  protected addReturnStockModal!: AddReturnStockComponent;

  protected readonly ActionButton = ActionButton;
  protected returnStockList: any[];

  protected currentPage: number = 1;
  protected pageSize: number = 5;
  protected count: number = 0;

  protected searchForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly stockReturnService: StockReturnService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadReturnStockTableData();
  }

  private createForm(): void {
    this.searchForm = this.fb.group({
      inputValue: [''],
      fromDate: [''],
      toDate: [''],
    });
  }

  protected onSubmit(): void {
    this.loadReturnStockTableData();
  }

  protected onRefresh(): void {
    this.loadReturnStockTableData();
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
        formattedToDate
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

  protected openReturnStockView(action: ActionButton, returnStock: any): void {
    this.viewReturnStockModal.loadData();
    this.viewReturnStockModal.action = action;
    this.viewReturnStockModal.returnStock = returnStock;
    this.viewReturnStockModal.visible = true;
  }

  protected onClear(): void {
    this.searchForm.reset();
    this.loadReturnStockTableData();
  }

  protected hasAnyValue(): boolean {
    const { inputValue, fromDate, toDate } = this.searchForm.value;

    return !!(inputValue || fromDate || toDate);
  }

  // constructor() {}
  // protected users: any[] = [];
  // protected pagedUsers: any[] = [];

  // ngOnInit(): void {
  //   // sample data
  //   this.users = Array.from({ length: 35 }, (_, i) => ({
  //     name: `User ${i + 1}`,
  //     nic: `NIC${1000 + i}`,
  //   }));

  //   this.updatePagedUsers();
  // }

  // protected goToPage(page: number): void {
  //   this.currentPage = page;
  //   this.updatePagedUsers();
  // }

  // protected onPageSizeChange(newSize: number): void {
  //   this.pageSize = newSize;
  //   this.currentPage = 1;
  //   this.updatePagedUsers();
  // }

  // protected updatePagedUsers(): void {
  //   const start = (this.currentPage - 1) * this.pageSize;
  //   const end = start + this.pageSize;
  //   this.pagedUsers = this.users.slice(start, end);
  // }

  // protected delete() {
  //   alertWarning({
  //     title: 'Confirm Delete',
  //     text: 'message',
  //   });
  // }
}
