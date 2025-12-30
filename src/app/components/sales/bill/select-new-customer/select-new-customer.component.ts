import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ICustomizeRouteData } from 'src/app/interfaces/ICustomizeRouteData';
import { IResponse } from 'src/app/interfaces/IResponse';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { RouteService } from 'src/app/services/route/route.service';
import { SaleService } from 'src/app/services/sale/sale.service';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { REGEX_MOBILE, REGEX_NAME } from 'src/app/utility/constants/validation';
import {
  alertError,
  alertSuccess,
  errorMessageHandler,
} from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-select-new-customer',
  templateUrl: './select-new-customer.component.html',
  styleUrls: ['./select-new-customer.component.scss'],
})
export class SelectNewCustomerComponent implements OnInit {
  protected selectedRoute: ICustomizeRouteData | null = null;
  protected customerForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly customerService: CustomerService,
    private readonly routeService: RouteService,
    private readonly saleService: SaleService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.selectedRoute = this.routeService.getSelectedRoute();
    if (!this.selectedRoute) {
      this.router.navigate(['../select-route'], {
        relativeTo: this.route,
        queryParamsHandling: 'preserve',
      });
    }
  }

  private createForm(): void {
    this.customerForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.pattern(REGEX_NAME)]],
      phone: ['', [Validators.required, Validators.pattern(REGEX_MOBILE)]],
      shopName: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  protected onSubmit(): void {
    this.customerService
      .addSalesmanCustomer(
        this.selectedRoute?.routeId!,
        this.customerForm.value
      )
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            alertSuccess({
              title: RESPONSE_TITLES.SUCCESS,
              text: RESPONSE_MESSAGES.CUSTOMER_ADD_EDIT_SUCCESS,
            });

            this.saleService.setSaleInitData(res.body.content);
            this.customerService.setSelectedCustomer(this.customerForm.value);
            this.router.navigate(['../select-product'], {
              relativeTo: this.route,
              queryParamsHandling: 'preserve',
            });
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message || RESPONSE_MESSAGES.CUSTOMER_ADD_EDIT_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }
}
