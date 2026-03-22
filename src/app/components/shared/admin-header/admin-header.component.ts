import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { HeaderComponent } from '@coreui/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, startWith } from 'rxjs';
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
  alertSuccess,
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

  protected notificationList: INotificationData[] = [];
  protected notificationCount: number = 0;
  protected selectedIds: Set<number> = new Set();

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

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
        startWith(null),
      )
      .subscribe(() => {
        this.fetchUnreadNotificationCount();
      });
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
              this.storageService.clearSession();
              this.router.navigate(['admin']);
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
    if (!this.shouldFetchNotifications(this.router.url)) {
      this.notificationList = [];
      this.selectedIds.clear();
      return;
    }

    this.alertService
      .getNotificationList()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res) => {
          if (res.body.status === RSP_SUCCESS) {
            this.notificationList = res.body.content.notifications.slice(0, 10);
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

  protected fetchUnreadNotificationCount(): void {
    if (!this.shouldFetchNotifications(this.router.url)) {
      this.notificationCount = 0;
      return;
    }

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

  private shouldFetchNotifications(url: string): boolean {
    const hasAccessToken = !!this.storageService.get(SESSION_DATA.ACCESS_TOKEN);
    return hasAccessToken && url.includes('/admin/post-login');
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
