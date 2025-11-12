import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { RouteViewComponent } from './route-view/route-view.component';
import { alertWarning } from 'src/app/utility/helper';

@Component({
  selector: 'app-customer-routes',
  templateUrl: './customer-routes.component.html',
  styleUrls: ['./customer-routes.component.scss'],
})
export class CustomerRoutesComponent implements OnInit {
  @ViewChild('customerModal') protected customerModal!: CustomerViewComponent;
  @ViewChild('routeModal') protected routeModal!: RouteViewComponent;

  protected users: any[] = [];
  protected routes: any[] = [];
  protected pagedUsers: any[] = [];
  protected pagedRoutes: any[] = [];

  protected currentUserPage = 1;
  protected currentRoutePage = 1;
  protected userPageSize = 5;
  protected routePageSize = 5;

  ngOnInit(): void {
    // sample data
    this.users = Array.from({ length: 35 }, (_, i) => ({
      name: `User ${i + 1}`,
      nic: `NIC${1000 + i}`,
    }));

    this.routes = Array.from({ length: 35 }, (_, i) => ({
      name: `User ${i + 1}`,
      nic: `NIC${1000 + i}`,
    }));

    this.updatePagedUsers();
    this.updatePagedRoute();
  }

  protected goToUserPage(page: number): void {
    this.currentUserPage = page;
    this.updatePagedUsers();
  }

  protected goToRoutePage(page: number): void {
    this.currentRoutePage = page;
    this.updatePagedUsers();
  }

  protected onUserPageSizeChange(newSize: number): void {
    this.userPageSize = newSize;
    this.currentUserPage = 1;
    this.updatePagedUsers();
  }

  protected onRoutePageSizeChange(newSize: number): void {
    this.routePageSize = newSize;
    this.currentRoutePage = 1;
    this.updatePagedRoute();
  }

  protected updatePagedUsers(): void {
    const start = (this.currentUserPage - 1) * this.userPageSize;
    const end = start + this.userPageSize;
    this.pagedUsers = this.users.slice(start, end);
  }

  protected updatePagedRoute(): void {
    const start = (this.currentRoutePage - 1) * this.routePageSize;
    const end = start + this.routePageSize;
    this.pagedRoutes = this.routes.slice(start, end);
  }

  protected openRouteView(route?: any) {
    this.routeModal.route = route;
    this.routeModal.visible = true;
  }

  protected openCustomerView(customer?: any) {
    this.customerModal.customer = customer;
    this.customerModal.visible = true;
  }

  protected deleteRoute() {
    alertWarning({
      title: 'Confirm Delete',
      text: 'message',
    });
  }

  protected deleteCustomer() {
    alertWarning({
      title: 'Confirm Delete',
      text: 'message',
    });
  }
}
