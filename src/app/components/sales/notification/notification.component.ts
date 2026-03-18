import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { INotificationData } from 'src/app/interfaces/INotificationData';
import { AlertService } from 'src/app/services/alert/alert.service';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import {
  alertError,
  alertSuccess,
  errorMessageHandler,
} from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  protected notificationList: INotificationData[] = [];
  protected selectedIds: Set<number> = new Set();

  constructor(private readonly alertService: AlertService) {}

  ngOnInit(): void {
    this.loadAlertList();
  }

  protected loadAlertList(): void {
    this.alertService
      .getNotificationList()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          if (res.body.status === RSP_SUCCESS) {
            this.notificationList = res.body.content.notifications;
            this.selectedIds.clear();
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

  protected markAsRead(notification: INotificationData): void {
    if (notification.isRead) return;

    this.alertService
      .markAsReadNotification(notification.id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          if (res.body.status === RSP_SUCCESS) {
            notification.isRead = true;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.NOTIFICATION_MARK_AS_READ_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  protected get isAllSelected(): boolean {
    return (
      this.notificationList?.length > 0 &&
      this.notificationList.every((n) => this.selectedIds.has(n.id))
    );
  }

  protected toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.notificationList.forEach((n) => this.selectedIds.add(n.id));
    } else {
      this.selectedIds.clear();
    }
  }

  protected toggleSelect(id: number): void {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  }

  protected deleteSelected(): void {
    if (this.selectedIds.size === 0) return;

    const ids = Array.from(this.selectedIds).map((id) => id.toString());

    this.alertService
      .deleteMultipleNotification(ids)
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
            this.loadAlertList();
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
}
