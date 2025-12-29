import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
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
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss'],
})
export class RouteComponent implements OnInit {
  protected routeList: ICustomizeRouteData[] = [];
  constructor(
    private readonly routeService: RouteService,
    private readonly customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.loadRouteList();
  }

  private loadRouteList(): void {
    this.routeService
      .getSalesmanRouteList()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.routeList = res.body.content;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.ROUTE_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  protected toggleRoute(id: number): void {
    this.customerService
      .getSalesmanCustomerListByRouteId(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.routeList = this.routeList.map((route) =>
              route.routeId === id
                ? {
                    ...route,
                    customerList: res.body.content,
                    expanded: !route.expanded,
                  }
                : route
            );
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
}
