import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Location } from '@angular/common';
import { StorageService } from 'src/app/services/storage.service';
import { SESSION_DATA } from 'src/app/utility/constants/session-data';
import { AlertService } from 'src/app/services/alert/alert.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { alertError, errorMessageHandler } from 'src/app/utility/helper';
import { HttpErrorResponse } from '@angular/common/http';
import { IResponse } from 'src/app/interfaces/IResponse';

@UntilDestroy()
@Component({
  selector: 'app-sales-header',
  templateUrl: './sales-header.component.html',
  styleUrls: ['./sales-header.component.scss'],
})
export class SalesHeaderComponent implements OnInit {
  protected pageTitle: string;
  protected isSubPage = false;
  protected name: string;

  protected notificationCount: number = 0;

  constructor(
    private readonly router: Router,
    private readonly alertService: AlertService,
    private readonly location: Location,
    private readonly storageService: StorageService,
  ) {}

  ngOnInit(): void {
    this.name = `Hi, ${this.storageService.get(SESSION_DATA.NAME)}`;
    this.updateHeader(this.router.url);
    this.fetchUnreadNotificationCount();

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
      )
      .subscribe((event) => {
        this.updateHeader(event.urlAfterRedirects);
      });
  }

  protected updateHeader(url: string): void {
    if (url.includes('/sales/post-login/product')) {
      this.pageTitle = 'Products';
      this.isSubPage = true;
    } else if (url.includes('/sales/post-login/route')) {
      this.pageTitle = 'Routes & Customers';
      this.isSubPage = true;
    } else if (url.includes('/sales/post-login/settings')) {
      this.pageTitle = 'Settings';
      this.isSubPage = true;
    } else if (url.includes('/sales/post-login/bill')) {
      this.pageTitle = 'Add Bill';
      this.isSubPage = true;
    } else if (url.includes('/sales/post-login/payment')) {
      this.pageTitle = 'Payments';
      this.isSubPage = true;
    } else if (url.includes('/sales/post-login/easy-order/draft-order')) {
      this.pageTitle = 'Today Draft Orders';
      this.isSubPage = true;
    } else if (url.includes('/sales/post-login/easy-order')) {
      this.pageTitle = 'Easy Order';
      this.isSubPage = true;
    } else {
      this.pageTitle = this.name;
      this.isSubPage = false;
    }
  }

  protected fetchUnreadNotificationCount(): void {
    this.alertService
      .getUnreadNotificationCount()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
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

  protected goBack(): void {
    this.location.back();
  }
}
