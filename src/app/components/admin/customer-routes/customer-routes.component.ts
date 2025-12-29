import { Component, OnInit, ViewChild } from '@angular/core';
import {
  alertError,
  alertSuccess,
  alertWarning,
  datePickerToDate,
  errorMessageHandler,
} from 'src/app/utility/helper';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RouteService } from 'src/app/services/route/route.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { IPagination } from 'src/app/interfaces/IPagination';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from 'src/app/interfaces/IResponse';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { HttpErrorResponse } from '@angular/common/http';
import { IRouteData } from 'src/app/interfaces/IRouteData';
import { ICustomerData } from 'src/app/interfaces/ICustomerData';
import { SweetAlertResult } from 'sweetalert2';
import { AddEditViewCustomerComponent } from './add-edit-view-customer/add-edit-view-customer.component';
import { AddEditViewRouteComponent } from './add-edit-view-route/add-edit-view-route.component';

@UntilDestroy()
@Component({
  selector: 'app-customer-routes',
  templateUrl: './customer-routes.component.html',
  styleUrls: ['./customer-routes.component.scss'],
})
export class CustomerRoutesComponent implements OnInit {
  @ViewChild('addEditViewCustomerModal') protected addEditViewCustomerModal!: AddEditViewCustomerComponent;
  @ViewChild('addEditViewRouteModal') protected addEditViewRouteModal!: AddEditViewRouteComponent;

  protected readonly ActionButton = ActionButton;

  protected routeList: IRouteData[];
  protected customerList: ICustomerData[];

  protected currentCustomerPage = 1;
  protected currentRoutePage = 1;

  protected customerPageSize = 5;
  protected routePageSize = 5;

  protected routeCount: number = 0;
  protected customerCount: number = 0;

  protected searchRouteForm: FormGroup;
  protected searchCustomerForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly routeService: RouteService,
    private readonly customerService: CustomerService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadRouteTableData();
    this.loadCustomerTableData();
  }

  private createForm(): void {
    this.searchRouteForm = this.fb.group({
      inputValue: [''],
      fromDate: [''],
      toDate: [''],
    });

    this.searchCustomerForm = this.fb.group({
      inputValue: [''],
      fromDate: [''],
      toDate: [''],
    });
  }

  protected onRouteSubmit(): void {
    this.loadRouteTableData();
  }

  protected onCustomerSubmit(): void {
    this.loadCustomerTableData();
  }

  protected onRouteRefresh(): void {
    this.loadRouteTableData();
  }

  protected onCustomerRefresh(): void {
    this.loadCustomerTableData();
  }

  private loadCustomerTableData(): void {
    const { inputValue, fromDate, toDate } = this.searchCustomerForm.value;

    let formattedFromDate = null;
    let formattedToDate = null;
    if (fromDate) {
      formattedFromDate = datePickerToDate(fromDate);
    }

    if (toDate) {
      formattedToDate = datePickerToDate(toDate);
    }

    const paginationRequest: IPagination = {
      pageable: true,
      page: this.currentCustomerPage - 1,
      size: this.customerPageSize,
    };

    this.customerService
      .getCustomerList(
        paginationRequest,
        inputValue || '',
        formattedFromDate,
        formattedToDate
      )
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.customerList = res.body.content.content || [];
            this.customerCount = res.body.content.totalElements || 0;
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

  private loadRouteTableData(): void {
    const { inputValue, fromDate, toDate } = this.searchRouteForm.value;

    let formattedFromDate = null;
    let formattedToDate = null;
    if (fromDate) {
      formattedFromDate = datePickerToDate(fromDate);
    }

    if (toDate) {
      formattedToDate = datePickerToDate(toDate);
    }

    const paginationRequest: IPagination = {
      pageable: true,
      page: this.currentRoutePage - 1,
      size: this.routePageSize,
    };

    this.routeService
      .getRouteList(
        paginationRequest,
        inputValue || '',
        formattedFromDate,
        formattedToDate
      )
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.routeList = res.body.content.content || [];
            this.routeCount = res.body.content.totalElements || 0;
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

  protected goToCustomerPage(page: number): void {
    this.currentCustomerPage = page;
    this.loadCustomerTableData();
  }

  protected goToRoutePage(page: number): void {
    this.currentRoutePage = page;
    this.loadRouteTableData();
  }

  protected onCustomerPageSizeChange(newSize: number): void {
    this.customerPageSize = newSize;
    this.currentCustomerPage = 1;
    this.loadCustomerTableData();
  }

  protected onRoutePageSizeChange(newSize: number): void {
    this.routePageSize = newSize;
    this.currentRoutePage = 1;
    this.loadRouteTableData();
  }

  protected onRouteClear(): void {
    this.searchRouteForm.reset();
    this.loadRouteTableData();
  }

  protected onCustomerClear(): void {
    this.searchCustomerForm.reset();
    this.loadCustomerTableData();
  }

  protected hasAnyRouteValue(): boolean {
    const { inputValue, fromDate, toDate } = this.searchRouteForm.value;

    return !!(inputValue || fromDate || toDate);
  }

  protected hasAnyCustomerValue(): boolean {
    const { inputValue, fromDate, toDate } = this.searchCustomerForm.value;

    return !!(inputValue || fromDate || toDate);
  }

  protected openRouteView(action: ActionButton, route?: IRouteData): void {
    this.addEditViewRouteModal.action = action;
    this.addEditViewRouteModal.route = route;
    this.addEditViewRouteModal.visible = true;
  }

  protected openCustomerView(
    action: ActionButton,
    customer?: ICustomerData
  ): void {
    this.addEditViewCustomerModal.loadData();
    this.addEditViewCustomerModal.action = action;
    this.addEditViewCustomerModal.customer = customer;
    this.addEditViewCustomerModal.visible = true;
  }

  protected onDeleteRoute(id: number): void {
    alertWarning(
      {
        title: RESPONSE_TITLES.WARNING,
        text: RESPONSE_MESSAGES.DELETE_CONFIRMATION,
      },
      (result: SweetAlertResult<any>) => {
        if (result.isConfirmed) {
          this.routeService
            .deleteRoute(id)
            .pipe(untilDestroyed(this))
            .subscribe({
              next: (res: IResponse) => {
                if (res.body.status === RSP_SUCCESS) {
                  this.loadRouteTableData();
                  alertSuccess({
                    title: RESPONSE_TITLES.DONE,
                    text:
                      res.body.message ||
                      RESPONSE_MESSAGES.VEHICLE_DELETE_SUCCESS,
                  });
                } else {
                  alertError({
                    title: RESPONSE_TITLES.FAILED,
                    text:
                      res.body.message || RESPONSE_MESSAGES.ROUTE_DELETE_FAILED,
                  });
                }
              },
              error: (err: HttpErrorResponse) => {
                errorMessageHandler(err);
              },
            });
        }
      }
    );
  }

  protected onDeleteCustomer(routeId: number, customerId: number): void {
    alertWarning(
      {
        title: RESPONSE_TITLES.WARNING,
        text: RESPONSE_MESSAGES.DELETE_CONFIRMATION,
      },
      (result: SweetAlertResult<any>) => {
        if (result.isConfirmed) {
          this.customerService
            .deleteCustomer(routeId, [{ customerId: customerId.toString() }])
            .pipe(untilDestroyed(this))
            .subscribe({
              next: (res: IResponse) => {
                if (res.body.status === RSP_SUCCESS) {
                  this.loadCustomerTableData();
                  alertSuccess({
                    title: RESPONSE_TITLES.DONE,
                    text:
                      res.body.message ||
                      RESPONSE_MESSAGES.CUSTOMER_DELETE_SUCCESS,
                  });
                } else {
                  alertError({
                    title: RESPONSE_TITLES.FAILED,
                    text:
                      res.body.message ||
                      RESPONSE_MESSAGES.CUSTOMER_DELETE_FAILED,
                  });
                }
              },
              error: (err: HttpErrorResponse) => {
                errorMessageHandler(err);
              },
            });
        }
      }
    );
  }
}
