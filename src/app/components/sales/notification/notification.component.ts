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
import { alertError, errorMessageHandler } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  protected notificationList: INotificationData[];

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
}
