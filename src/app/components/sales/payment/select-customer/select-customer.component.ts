import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ICustomerData } from 'src/app/interfaces/ICustomerData';
import { ICustomizeRouteData } from 'src/app/interfaces/ICustomizeRouteData';
import { IResponse } from 'src/app/interfaces/IResponse';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { RouteService } from 'src/app/services/route/route.service';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { alertError, errorMessageHandler } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-select-customer',
  templateUrl: './select-customer.component.html',
  styleUrls: ['./select-customer.component.scss'],
})
export class SelectCustomerComponent implements OnInit {
  protected selectedRoute: ICustomizeRouteData | null = null;
  protected customerList: Partial<ICustomerData>[] = [];
  protected filteredCustomerList: Partial<ICustomerData>[] = [];
  protected customerSearchTerm: string;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly customerService: CustomerService,
    private readonly routeService: RouteService,
  ) {}

  ngOnInit(): void {
    this.selectedRoute = this.routeService.getSelectedRoute();
    if (!this.selectedRoute) {
      this.router.navigate(['../select-route'], {
        relativeTo: this.route,
      });
    }
    this.loadCustomerList();
  }

  private loadCustomerList(): void {
    this.customerService
      .getSalesmanCustomerListByRouteId(this.selectedRoute?.routeId!)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.customerList = res.body.content;
            this.filteredCustomerList = this.customerList;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.CUSTOMER_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  protected filterCustomers(): void {
    const term = this.customerSearchTerm.toLowerCase();
    this.filteredCustomerList = this.customerList.filter(
      (customer) =>
        customer.customerName!.toLowerCase().includes(term) ||
        customer.shopName!.toLowerCase().includes(term) ||
        customer.address!.toLowerCase().includes(term)
    );
  }

  protected navigateNext(customer: Partial<ICustomerData>): void {
    this.router.navigate(['../select-bill'], { relativeTo: this.route });
  }
}
