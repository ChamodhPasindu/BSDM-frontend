import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserRole } from 'src/app/enums/UserRole.enum';
import { INotificationData } from 'src/app/interfaces/INotificationData';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { SESSION_DATA } from 'src/app/utility/constants/session-data';
import {
  alertError,
  alertWarning,
  errorMessageHandler,
} from 'src/app/utility/helper';
import { SweetAlertResult } from 'sweetalert2';

@UntilDestroy()
@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss'],
})
export class AdminHeaderComponent extends HeaderComponent implements OnInit {
  protected isDarkMode: boolean = false;
  @Input() public sidebarId: string = 'sidebar';

  protected name: string;
  protected userRole: string;
  protected lastLoggedInTime: string;
  protected profileImg: string = './assets/images/user-img.jpg';

  protected notificationList: INotificationData[];
  protected notificationCount: number = 0;

  constructor(
    private readonly router: Router,
    private readonly storageService: StorageService,
    private readonly authService: AuthService,
    private readonly alertService: AlertService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('dark-theme') === '1';
    this.applyTheme();
    this.loadSessionData();

    this.loadAlertList();
    this.fetchUnreadNotificationCount();
  }

  private loadSessionData(): void {
    this.name = this.storageService.get(SESSION_DATA.NAME)!;
    this.userRole = this.storageService.get(SESSION_DATA.ROLE)!;
    this.profileImg = this.storageService.get(SESSION_DATA.PRO_IMG)!;
    this.lastLoggedInTime = this.storageService.get(SESSION_DATA.LAST_LOGIN)!;
  }

  protected onLogOut(): void {
    alertWarning(
      {
        title: 'Log Out',
        text: 'Are you sure you want to log out?',
      },
      (result: SweetAlertResult<any>) => {
        if (result.isConfirmed) {
          this.authService
            .logout()
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this.router.navigate(['admin']);
              this.storageService.clearSession();
            });
        }
      },
    );
  }

  protected setTheme(dark: boolean): void {
    this.isDarkMode = dark;
    localStorage.setItem('dark-theme', dark ? '1' : '0');
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  protected loadAlertList(): void {
    this.alertService
      .getNotificationList()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          if (res.body.status === RSP_SUCCESS) {
            this.notificationList = res.body.content.notifications.slice(0, 10);
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

  protected fetchUnreadNotificationCount(): void {
    this.alertService
      .getUnreadNotificationCount()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          if (res.body.status === RSP_SUCCESS) {
            this.notificationCount = res.body.content.unreadCount;
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
