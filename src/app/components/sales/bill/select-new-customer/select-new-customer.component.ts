import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { untilDestroyed } from '@ngneat/until-destroy';
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

@Component({
  selector: 'app-select-new-customer',
  templateUrl: './select-new-customer.component.html',
  styleUrls: ['./select-new-customer.component.scss'],
})
export class SelectNewCustomerComponent implements OnInit {
  protected selectedRoute: ICustomizeRouteData | null = null;
  protected customerList: Partial<ICustomerData>[] = [];
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly customerService: CustomerService,
    private readonly routeService: RouteService
  ) {}

  ngOnInit(): void {
    this.selectedRoute = this.routeService.getSelectedRoute();

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

  protected navigateNext(): void {
    this.router.navigate(['../select-product'], { relativeTo: this.route });
  }

  customerName: string = '';
  customerPhone: string = '';
  customerAddress: string = '';

  submitCustomer() {
    const customerData = {
      name: this.customerName,
      phone: this.customerPhone,
      address: this.customerAddress,
    };
    console.log('Customer Submitted:', customerData);
    alert('Customer Added Successfully!');

    // Reset for new entry
    this.customerName = '';
    this.customerPhone = '';
    this.customerAddress = '';
  }
}
