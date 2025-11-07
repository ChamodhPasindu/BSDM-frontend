import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sales-header',
  templateUrl: './sales-header.component.html',
  styleUrls: ['./sales-header.component.scss'],
})
export class SalesHeaderComponent implements OnInit {
  pageTitle = 'Hi ,Chamodh';
  isSubPage = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.updateHeader(this.router.url); // 👈 Run once on load

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
    } else if (url.includes('/sales/post-login/new')) {
      this.pageTitle = 'New Customer';
      this.isSubPage = true;
    } else if (url.includes('/sales/post-login/existing')) {
      this.pageTitle = 'Existing Customer';
      this.isSubPage = true;
    } else {
      this.pageTitle = 'Hi ,Chamodh';
      this.isSubPage = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/sales/post-login/'], { relativeTo: this.route });
  }
}
