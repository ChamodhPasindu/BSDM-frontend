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
import * as moment from 'moment';
import { PdfExportService } from 'src/app/services/general/pdf-export.service';

@UntilDestroy()
@Component({
  selector: 'app-customer-routes',
  templateUrl: './customer-routes.component.html',
  styleUrls: ['./customer-routes.component.scss'],
})
export class CustomerRoutesComponent implements OnInit {
  @ViewChild('addEditViewCustomerModal')
  private readonly addEditViewCustomerModal!: AddEditViewCustomerComponent;
  @ViewChild('addEditViewRouteModal')
  private readonly addEditViewRouteModal!: AddEditViewRouteComponent;

  protected readonly ActionButton = ActionButton;

  protected routeList: IRouteData[];
  protected customerList: ICustomerData[];

  protected currentCustomerPage = 1;
  protected currentRoutePage = 1;

  protected customerPageSize = 5;
  protected routePageSize = 5;

  protected routeCount: number = 0;
  protected customerCount: number = 0;

  protected totalRouteCount: number = 0;
  protected activeRouteCount: number = 0;
  protected deactivateRouteCount: number = 0;
  protected suspendRouteCount: number = 0;

  protected totalCustomerCount: number = 0;
  protected activeCustomerCount: number = 0;
  protected deactivateCustomerCount: number = 0;
  protected suspendCustomerCount: number = 0;

  protected searchRouteForm: FormGroup;
  protected searchCustomerForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly routeService: RouteService,
    private readonly customerService: CustomerService,
    private readonly pdfExportService: PdfExportService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadRouteTableData();
    this.loadCustomerTableData();
    this.loadRouteAndCustomerWidgetData();
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
        formattedToDate,
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

  private loadRouteAndCustomerWidgetData(): void {
    this.routeService
      .getRouteWidget()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            // route widget data
            this.totalRouteCount =
              res.body.content.routeDashboardResponseDTO.totalRoute;
            this.activeRouteCount =
              res.body.content.routeDashboardResponseDTO.statusWiseCounts.find(
                (x: Record<string, string>) =>
                  x['statusDescription'] === 'ACTIVE',
              )?.count || 0;

            this.deactivateRouteCount =
              res.body.content.routeDashboardResponseDTO.statusWiseCounts.find(
                (x: Record<string, string>) =>
                  x['statusDescription'] === 'DEACTIVE',
              )?.count || 0;

            this.suspendRouteCount =
              res.body.content.routeDashboardResponseDTO.statusWiseCounts.find(
                (x: Record<string, string>) =>
                  x['statusDescription'] === 'DELETED',
              )?.count || 0;

            // customer widget data
            this.totalCustomerCount =
              res.body.content.customerDashboardResponseDTO.totalCustomer;

            this.activeCustomerCount =
              res.body.content.customerDashboardResponseDTO.statusWiseCounts.find(
                (x: Record<string, string>) => x['statusCode'] === 'ACTIVE',
              )?.count || 0;

            this.deactivateCustomerCount =
              res.body.content.customerDashboardResponseDTO.statusWiseCounts.find(
                (x: Record<string, string>) => x['statusCode'] === 'DEACTIVE',
              )?.count || 0;

            this.suspendCustomerCount =
              res.body.content.customerDashboardResponseDTO.statusWiseCounts.find(
                (x: Record<string, string>) => x['statusCode'] === 'DELETED',
              )?.count || 0;
          } else {
            alertWarning({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.ROUTE_AND_CUSTOMER_WIDGET_GET_FAILED,
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
        formattedToDate,
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

  protected onRouteExport(): void {
    if (!this.routeList || this.routeList.length === 0) {
      alertError({
        title: RESPONSE_TITLES.FAILED,
        text: RESPONSE_MESSAGES.ROUTE_EXPORT_FAILED,
      });
      return;
    }

    const columns = [
      { header: 'ID', width: 0.05 },
      { header: 'Route Name', width: 0.2 },
      { header: 'Description', width: 0.35 },
      { header: 'Created Date', width: 0.2 },
      { header: 'Status', width: 0.2 },
    ];

    const data = this.routeList.map((route) => [
      route.routeId.toString(),
      route.routeName || '',
      route.description || '',
      route.createdAt ? moment(route.createdAt).format('YYYY-MM-DD') : '',
      route.statusDescription || '',
    ]);

    this.pdfExportService.exportToPdf({
      title: 'Route Management Report',
      columns: columns,
      data: data,
      filename: `Route_Report_${moment().format('YYYY-MM-DD_HH-mm-ss')}.pdf`,
      companyName: 'Visco Bakehouse Sales Delivery Monitoring System',
      mobileNumber: '+94 (0) 123 456 789',
      orientation: 'landscape',
    });
  }

  protected onCustomerExport(): void {
    if (!this.customerList || this.customerList.length === 0) {
      alertError({
        title: RESPONSE_TITLES.FAILED,
        text: RESPONSE_MESSAGES.CUSTOMER_EXPORT_FAILED,
      });
      return;
    }

    const columns = [
      { header: 'ID', width: 0.06 },
      { header: 'Customer Name', width: 0.15 },
      { header: 'Address', width: 0.2 },
      { header: 'Mobile', width: 0.1 },
      { header: 'Shop Name', width: 0.2 },
      { header: 'Route Name', width: 0.11 },
      { header: 'Created Date', width: 0.1 },
      { header: 'Status', width: 0.06 },
    ];

    const data = this.customerList.map((customer) => [
      customer.customerId.toString(),
      customer.customerName || '',
      customer.address || '',
      customer.phone || '',
      customer.shopName || '',
      customer.routeName || '',
      customer.addedDate ? moment(customer.addedDate).format('YYYY-MM-DD') : '',
      customer.statusDescription || '',
    ]);

    this.pdfExportService.exportToPdf({
      title: 'Customer Management Report',
      columns: columns,
      data: data,
      filename: `Customer_Report_${moment().format('YYYY-MM-DD_HH-mm-ss')}.pdf`,
      companyName: 'Visco Bakehouse Sales Delivery Monitoring System',
      mobileNumber: '+94 (0) 123 456 789',
      orientation: 'landscape',
    });
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
    customer?: ICustomerData,
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
      },
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
      },
    );
  }
}
