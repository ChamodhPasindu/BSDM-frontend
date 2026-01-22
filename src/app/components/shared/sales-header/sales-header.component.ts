import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Location } from '@angular/common';
import { StorageService } from 'src/app/services/storage.service';
import { SESSION_DATA } from 'src/app/utility/constants/session-data';

@Component({
  selector: 'app-sales-header',
  templateUrl: './sales-header.component.html',
  styleUrls: ['./sales-header.component.scss'],
})
export class SalesHeaderComponent implements OnInit {
  protected pageTitle: string;
  protected isSubPage = false;
  protected name: string;
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
    private readonly storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.name = `Hi, ${this.storageService.get(SESSION_DATA.NAME)}`;
    this.updateHeader(this.router.url);

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
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

  protected goBack(): void {
    this.location.back();
  }
}
