import { Component, OnInit, ViewChild } from '@angular/core';
import {
  alertError,
  alertSuccess,
  alertWarning,
  datePickerToDate,
  errorMessageHandler,
} from 'src/app/utility/helper';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ItemService } from 'src/app/services/item/item.service';
import { BatchService } from 'src/app/services/batch/batch.service';
import { IPagination } from 'src/app/interfaces/IPagination';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from 'src/app/interfaces/IResponse';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { HttpErrorResponse } from '@angular/common/http';
import { IItemData } from 'src/app/interfaces/IItemData';
import { IBatchData } from 'src/app/interfaces/IBatchData';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { SweetAlertResult } from 'sweetalert2';
import { AddEditViewItemComponent } from './add-edit-view-item/add-edit-view-item.component';
import { AddEditViewBatchComponent } from './add-edit-view-batch/add-edit-view-batch.component';

@UntilDestroy()
@Component({
  selector: 'app-item-batch',
  templateUrl: './item-batch.component.html',
  styleUrls: ['./item-batch.component.scss'],
})
export class ItemBatchComponent implements OnInit {
  @ViewChild('addEditViewItemModal')
  protected addEditViewItemModal!: AddEditViewItemComponent;
  @ViewChild('addEditViewBatchModal') protected addEditViewBatchModal!: AddEditViewBatchComponent;

  protected readonly ActionButton = ActionButton;

  protected itemList: IItemData[];
  protected batchList: IBatchData[];

  protected currentItemPage = 1;
  protected currentBatchPage = 1;

  protected itemPageSize = 5;
  protected batchPageSize = 5;

  protected itemCount: number = 0;
  protected batchCount: number = 0;

  protected searchItemForm: FormGroup;
  protected searchBatchForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly itemService: ItemService,
    private readonly batchService: BatchService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadItemTableData();
    this.loadBatchTableData();
  }

  private createForm(): void {
    this.searchItemForm = this.fb.group({
      inputValue: [''],
      fromDate: [''],
      toDate: [''],
    });

    this.searchBatchForm = this.fb.group({
      inputValue: [''],
      fromDate: [''],
      toDate: [''],
    });
  }

  protected onItemSubmit(): void {
    this.loadItemTableData();
  }

  protected onBatchSubmit(): void {
    this.loadBatchTableData();
  }

  protected onItemRefresh(): void {
    this.loadItemTableData();
  }

  protected onBatchRefresh(): void {
    this.loadBatchTableData();
  }

  private loadBatchTableData(): void {
    const { inputValue, fromDate, toDate } = this.searchBatchForm.value;

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
      page: this.currentBatchPage - 1,
      size: this.batchPageSize,
    };

    this.batchService
      .getBatchList(
        paginationRequest,
        inputValue || '',
        formattedFromDate,
        formattedToDate
      )
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.batchList = res.body.content.content || [];
            this.batchCount = res.body.content.totalElements || 0;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.BATCH_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private loadItemTableData(): void {
    const { inputValue, fromDate, toDate } = this.searchItemForm.value;

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
      page: this.currentItemPage - 1,
      size: this.itemPageSize,
    };

    this.itemService
      .getItemList(
        paginationRequest,
        inputValue || '',
        formattedFromDate,
        formattedToDate
      )
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.itemList = res.body.content.content || [];
            this.itemCount = res.body.content.totalElements || 0;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.ITEM_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  protected goToItemPage(page: number): void {
    this.currentItemPage = page;
    this.loadItemTableData();
  }

  protected goToBatchPage(page: number): void {
    this.currentBatchPage = page;
    this.loadBatchTableData();
  }

  protected onItemPageSizeChange(newSize: number): void {
    this.itemPageSize = newSize;
    this.currentItemPage = 1;
    this.loadItemTableData();
  }

  protected onBatchPageSizeChange(newSize: number): void {
    this.batchPageSize = newSize;
    this.currentBatchPage = 1;
    this.loadBatchTableData();
  }

  protected onItemClear(): void {
    this.searchItemForm.reset();
    this.loadItemTableData();
  }

  protected onBatchClear(): void {
    this.searchBatchForm.reset();
    this.loadBatchTableData();
  }

  protected hasAnyItemValue(): boolean {
    const { inputValue, fromDate, toDate } = this.searchItemForm.value;

    return !!(inputValue || fromDate || toDate);
  }

  protected hasAnyBatchValue(): boolean {
    const { inputValue, fromDate, toDate } = this.searchBatchForm.value;

    return !!(inputValue || fromDate || toDate);
  }

  protected openItemView(action: ActionButton, item?: IItemData) {
    this.addEditViewItemModal.action = action;
    this.addEditViewItemModal.item = item;
    this.addEditViewItemModal.visible = true;
  }

  protected openBatchView(action: ActionButton, batch?: IBatchData) {
    this.addEditViewBatchModal.action = action;
    this.addEditViewBatchModal.batch = batch;
    this.addEditViewBatchModal.visible = true;
  }

  protected onDeleteItem(id: number) {
    alertWarning(
      {
        title: RESPONSE_TITLES.WARNING,
        text: RESPONSE_MESSAGES.DELETE_CONFIRMATION,
      },
      (result: SweetAlertResult<any>) => {
        if (result.isConfirmed) {
          this.itemService
            .deleteItem(id)
            .pipe(untilDestroyed(this))
            .subscribe({
              next: (res: IResponse) => {
                if (res.body.status === RSP_SUCCESS) {
                  this.loadItemTableData();
                  alertSuccess({
                    title: RESPONSE_TITLES.DONE,
                    text:
                      res.body.message || RESPONSE_MESSAGES.ITEM_DELETE_SUCCESS,
                  });
                } else {
                  alertError({
                    title: RESPONSE_TITLES.FAILED,
                    text:
                      res.body.message || RESPONSE_MESSAGES.ITEM_DELETE_FAILED,
                  });
                }
              },
              error: (err: HttpErrorResponse) => {
                errorMessageHandler(err);
              },
            });
        }
      }
    );
  }

  protected onDeleteBatch(id: number) {
    alertWarning(
      {
        title: RESPONSE_TITLES.WARNING,
        text: RESPONSE_MESSAGES.DELETE_CONFIRMATION,
      },
      (result: SweetAlertResult<any>) => {
        if (result.isConfirmed) {
          this.batchService
            .deleteBatch(id)
            .pipe(untilDestroyed(this))
            .subscribe({
              next: (res: IResponse) => {
                if (res.body.status === RSP_SUCCESS) {
                  this.loadBatchTableData();
                  alertSuccess({
                    title: RESPONSE_TITLES.DONE,
                    text:
                      res.body.message ||
                      RESPONSE_MESSAGES.BATCH_DELETE_SUCCESS,
                  });
                } else {
                  alertError({
                    title: RESPONSE_TITLES.FAILED,
                    text:
                      res.body.message || RESPONSE_MESSAGES.BATCH_DELETE_FAILED,
                  });
                }
              },
              error: (err: HttpErrorResponse) => {
                errorMessageHandler(err);
              },
            });
        }
      }
    );
  }
}
