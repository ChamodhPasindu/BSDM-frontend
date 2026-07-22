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
import * as moment from 'moment';
import { PdfExportService } from 'src/app/services/general/pdf-export.service';

@UntilDestroy()
@Component({
  selector: 'app-item-batch',
  templateUrl: './item-batch.component.html',
  styleUrls: ['./item-batch.component.scss'],
})
export class ItemBatchComponent implements OnInit {
  @ViewChild('addEditViewItemModal')
  private readonly addEditViewItemModal!: AddEditViewItemComponent;
  @ViewChild('addEditViewBatchModal')
  private readonly addEditViewBatchModal!: AddEditViewBatchComponent;

  protected readonly ActionButton = ActionButton;

  protected itemList: IItemData[];
  protected batchList: IBatchData[];

  protected currentItemPage = 1;
  protected currentBatchPage = 1;

  protected itemPageSize = 5;
  protected batchPageSize = 5;

  protected itemCount: number = 0;
  protected batchCount: number = 0;

  protected totalItemCount: number = 0;
  protected activeItemCount: number = 0;
  protected deleteItemCount: number = 0;

  protected totalBatchCount: number = 0;
  protected expiredBatchCount: number = 0;
  protected freshBatchCount: number = 0;

  protected searchItemForm: FormGroup;
  protected searchBatchForm: FormGroup;
  protected today = new Date();

  constructor(
    private readonly fb: FormBuilder,
    private readonly itemService: ItemService,
    private readonly batchService: BatchService,
    private readonly pdfExportService: PdfExportService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadItemTableData();
    this.loadBatchTableData();
    this.loadItemBatchWidgetData();
  }

  private createForm(): void {
    this.searchItemForm = this.fb.group({
      inputValue: [''],
      fromDate: [this.today],
      toDate: [this.today],
    });

    this.searchBatchForm = this.fb.group({
      inputValue: [''],
      fromDate: [this.today],
      toDate: [this.today],
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
    this.loadItemBatchWidgetData();
  }

  protected onBatchRefresh(): void {
    this.loadBatchTableData();
    this.loadItemBatchWidgetData();
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
        formattedToDate,
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
        formattedToDate,
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

  private loadItemBatchWidgetData(): void {
    this.itemService
      .getItemWidget()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.totalItemCount = res.body.content?.totalItem || 0;
            this.activeItemCount =
              res.body.content.itemStatusWiseCounts?.find(
                (x: Record<string, string>) =>
                  x['statusDescription'] === 'ACTIVE_ITEMNAME',
              )?.count || 0;

            this.deleteItemCount =
              res.body.content.itemStatusWiseCounts?.find(
                (x: Record<string, string>) =>
                  x['statusDescription'] === 'DELETED_ITEMNAME',
              )?.count || 0;

            this.totalBatchCount = res.body.content?.totalBatch || 0;

            this.expiredBatchCount =
              res.body.content.batchStatusWiseCounts?.find(
                (x: Record<string, string>) => x['statusCode'] === 'EXPIRED',
              )?.count || 0;

            this.freshBatchCount =
              res.body.content.batchStatusWiseCounts?.find(
                (x: Record<string, string>) => x['statusCode'] === 'FRESH',
              )?.count || 0;
          } else {
            alertWarning({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message || RESPONSE_MESSAGES.ITEM_WIDGET_GET_FAILED,
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

  protected onItemExport(): void {
    if (!this.itemList || this.itemList.length === 0) {
      alertError({
        title: RESPONSE_TITLES.FAILED,
        text: RESPONSE_MESSAGES.ITEM_EXPORT_FAILED,
      });
      return;
    }

    const columns = [
      { header: 'ID', width: 0.1 },
      { header: 'Name', width: 0.2 },
      { header: 'Description', width: 0.3 },
      { header: 'Alert Quantity', width: 0.2 },
      { header: 'Created Date', width: 0.2 },
    ];

    const data = this.itemList.map((item) => [
      item.nameId.toString(),
      item.name || '',
      item.description || '',
      item.alertQuantity || '',
      item.createdAt ? moment(item.createdAt).format('YYYY-MM-DD') : '',
    ]);

    this.pdfExportService.exportToPdf({
      title: 'Item Report',
      columns: columns,
      data: data,
      filename: `Item_Report_${moment().format('YYYY-MM-DD_HH-mm-ss')}.pdf`,
      companyName: 'Visco Bakehouse Sales Delivery Monitoring System',
      mobileNumber: '+94 (0) 123 456 789',
      orientation: 'landscape',
    });
  }

  protected onBatchExport(): void {
    if (!this.batchList || this.batchList.length === 0) {
      alertError({
        title: RESPONSE_TITLES.FAILED,
        text: RESPONSE_MESSAGES.BATCH_EXPORT_FAILED,
      });
      return;
    }

    const columns = [
      { header: 'ID', width: 0.06 },
      { header: 'Batch Code', width: 0.13 },
      { header: 'Manufacture Date', width: 0.16 },
      { header: 'Expire Date', width: 0.14 },
      { header: 'Usable Days', width: 0.09 },
      { header: 'Quantity', width: 0.09 },
      { header: 'Warehouse', width: 0.12 },
      { header: 'Created Date', width: 0.11 },
      { header: 'Status', width: 0.1 },
    ];

    const data = this.batchList.map((batch) => [
      batch.batchId.toString(),
      batch.batchCode || '',
      batch.manufactureDate
        ? moment(batch.manufactureDate).format('YYYY-MM-DD')
        : '',
      batch.expiryDate ? moment(batch.expiryDate).format('YYYY-MM-DD') : '',
      batch.usableDays,
      batch.remainingQuantity,
      batch.warehouseLocation || '',
      batch.createdAt ? moment(batch.createdAt).format('YYYY-MM-DD') : '',
      batch.statusDescription || '',
    ]);

    this.pdfExportService.exportToPdf({
      title: 'Batch Report',
      columns: columns,
      data: data,
      filename: `Batch_Report_${moment().format('YYYY-MM-DD_HH-mm-ss')}.pdf`,
      companyName: 'Visco Bakehouse Sales Delivery Monitoring System',
      mobileNumber: '+94 (0) 123 456 789',
      orientation: 'landscape',
    });
  }

  protected onItemClear(): void {
    this.searchItemForm.reset({
      fromDate: this.today,
      toDate: this.today,
    });
    this.loadItemTableData();
  }

  protected onBatchClear(): void {
    this.searchBatchForm.reset({
      fromDate: this.today,
      toDate: this.today,
    });
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
                  this.loadItemBatchWidgetData();
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
      },
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
                  this.loadItemBatchWidgetData();
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
      },
    );
  }
}
