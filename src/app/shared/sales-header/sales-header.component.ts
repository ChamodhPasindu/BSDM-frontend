import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sales-header',
  templateUrl: './sales-header.component.html',
  styleUrls: ['./sales-header.component.scss'],
})
export class SalesHeaderComponent implements OnInit {
  pageTitle = 'Hi ,Chamodh';
  isSubPage = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
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

  updateHeader(url: string): void {
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
    } else {
      this.pageTitle = 'Hi ,Chamodh';
      this.isSubPage = false;
    }
  }

  goBack(): void {
    this.location.back();
  }
}
