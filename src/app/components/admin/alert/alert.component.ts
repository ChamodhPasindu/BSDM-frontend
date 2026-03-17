import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertViewComponent } from './alert-view/alert-view.component';
import {
  alertError,
  alertSuccess,
  alertWarning,
  datePickerToDate,
  errorMessageHandler,
} from 'src/app/utility/helper';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IPagination } from 'src/app/interfaces/IPagination';
import { AlertService } from 'src/app/services/alert/alert.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from 'src/app/interfaces/IResponse';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { HttpErrorResponse } from '@angular/common/http';
import { INotificationData } from 'src/app/interfaces/INotificationData';
import { SweetAlertResult } from 'sweetalert2';

@UntilDestroy()
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  @ViewChild('addAlertModal') protected addAlertModal!: AlertViewComponent;

  protected readonly statusList: Record<string, string>[] = [
    { code: '', description: 'All' },
    { code: 'true', description: 'Read' },
    { code: 'false', description: 'Unread' },
  ];

  protected notificationList: INotificationData[];

  protected currentPage: number = 1;
  protected pageSize: number = 5;
  protected count: number = 0;

  protected searchForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly alertService: AlertService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadAlertTableData();
  }

  protected createForm(): void {
    this.searchForm = this.fb.group({
      inputUsername: [''],
      title: [''],
      isRead: [''],
      fromDate: [''],
      toDate: [''],
    });
  }

  private loadAlertTableData(): void {
    const { inputUsername, title, isRead, fromDate, toDate } =
      this.searchForm.value;

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

    this.alertService
      .getAdminNotificationList(
        paginationRequest,
        inputUsername || '',
        isRead || null,
        title || '',
        formattedFromDate,
        formattedToDate,
      )
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.notificationList = res.body.content.content || [];
            this.count = res.body.content.totalElements || 0;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message || RESPONSE_MESSAGES.NOTIFICATION_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  protected onDeleteNotification(id: number): void {
    alertWarning(
      {
        title: RESPONSE_TITLES.WARNING,
        text: RESPONSE_MESSAGES.DELETE_CONFIRMATION,
      },
      (result: SweetAlertResult<any>) => {
        if (result.isConfirmed) {
          this.alertService
            .deleteSingleNotification(id)
            .pipe(untilDestroyed(this))
            .subscribe({
              next: (res) => {
                if (res.body.status === RSP_SUCCESS) {
                  alertSuccess({
                    title: RESPONSE_TITLES.SUCCESS,
                    text:
                      res.body.message ||
                      RESPONSE_MESSAGES.NOTIFICATION_DELETE_SUCCESS,
                  });
                  this.loadAlertTableData();
                } else {
                  alertError({
                    title: RESPONSE_TITLES.FAILED,
                    text:
                      res.body.message ||
                      RESPONSE_MESSAGES.NOTIFICATION_DELETE_FAILED,
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

  protected openAddAlertView(): void {
    this.addAlertModal.visible = true;
    this.addAlertModal.loadData();
  }

  protected onSubmit(): void {
    this.loadAlertTableData();
  }

  protected onRefresh(): void {
    this.loadAlertTableData();
  }

  protected goToPage(page: number): void {
    this.currentPage = page;
    this.loadAlertTableData();
  }

  protected onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadAlertTableData();
  }

  protected onClear(): void {
    this.searchForm.reset();
    this.loadAlertTableData();
  }

  protected hasAnyValue(): boolean {
    const { inputUsername, title, isRead, fromDate, toDate } =
      this.searchForm.value;

    return !!(inputUsername || title || isRead || fromDate || toDate);
  }

  // protected onExport(): void {}
}
