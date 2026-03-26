import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { CommonCode } from 'src/app/enums/CommonCode.enum';
import { ICustomer } from 'src/app/interfaces/ICustomer';
import { ICustomerData } from 'src/app/interfaces/ICustomerData';
import { IResponse } from 'src/app/interfaces/IResponse';
import { IRouteData } from 'src/app/interfaces/IRouteData';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { GeneralService } from 'src/app/services/general/general.service';
import { RouteService } from 'src/app/services/route/route.service';
import { UserStatus } from 'src/app/utility/constants/other-constant';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { REGEX_MOBILE, REGEX_NAME } from 'src/app/utility/constants/validation';
import { ModalControlDirective } from 'src/app/utility/directives/modal-control.directive';
import {
  alertError,
  alertSuccess,
  errorMessageHandler,
  onValidate,
} from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-add-edit-view-customer',
  templateUrl: './add-edit-view-customer.component.html',
  styleUrls: ['./add-edit-view-customer.component.scss'],
})
export class AddEditViewCustomerComponent
  extends ModalControlDirective
  implements OnInit
{
  protected readonly ActionButton = ActionButton;

  private _customer: ICustomerData | undefined;
  private _action: ActionButton;

  protected customerForm: FormGroup;

  protected routeList: IRouteData[];
  protected selectedRoute: IRouteData | null = null;

  protected statusList: Record<string, string | number>[];

  @Input()
  public set customer(value: ICustomerData | undefined) {
    this._customer = value;
  }

  public get customer() {
    return this._customer;
  }

  @Input()
  public set action(value: ActionButton) {
    this._action = value;
  }

  public get action() {
    return this._action;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly routeService: RouteService,
    private readonly customerService: CustomerService,
    private readonly generalService: GeneralService,
  ) {
    super();
    this.createForm();
  }

  ngOnInit(): void {
    this.loadStatusList();
  }

  protected override resetState(): void {
    this.customerForm.reset();
    this.customers.clear();
    this.onAddCustomerForm();
    this.selectedRoute = null;
  }

  public loadData(): void {
    this.loadRouteListData();
  }

  private loadStatusList(): void {
    this.generalService
      .getStatusList(CommonCode.CUSTOMER)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.statusList = res.body.content.dropdown;
            this.updateForm();
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.COMMON_ERROR_DES,
            });
          }
        },
        error: (err: HttpErrorResponse) => errorMessageHandler(err),
      });
  }

  private loadRouteListData(): void {
    this.routeService
      .getRouteList({ pageable: false })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.routeList = res.body.content.filter((route: IRouteData) => route.statusDescription === 'ACTIVE_ROUTES' ) || [];
            this.updateForm();
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

  private createForm(): void {
    this.customerForm = this.fb.group({
      routeId: [null, Validators.required],
      customers: this.fb.array([this.createCustomerForm()]),
    });
    this.setForm(this.customerForm);
  }

  private updateForm(): void {
    if (!this.action) return;

    this.selectedRoute = null;

    if (this.action === ActionButton.VIEW) {
      this.patchValue();
      this.customerForm.disable();
    }

    if (this.action === ActionButton.EDIT) {
      this.patchValue();
      this.customerForm.enable();
    }

    if (this.action === ActionButton.ADD) {
      this.customerForm.enable();
    }
  }

  private patchValue(): void {
    this.customerForm.get('routeId')?.setValue(this.customer?.routeId);

    this.selectedRoute =
      this.routeList?.find(
        (x: IRouteData) => x.routeId === this.customer?.routeId,
      ) || null;

    const customersArray = this.customerForm.get('customers') as FormArray;

    customersArray.at(0).patchValue({
      customerName: this.customer?.customerName,
      phone: this.customer?.phone,
      shopName: this.customer?.shopName,
      address: this.customer?.address,
      statusCode: this.customer?.statusCode,
    });
  }

  get customers(): FormArray {
    return this.customerForm.get('customers') as FormArray;
  }

  private createCustomerForm(): FormGroup {
    return this.fb.group({
      customerName: ['', [Validators.required, Validators.pattern(REGEX_NAME)]],
      phone: ['', [Validators.required, Validators.pattern(REGEX_MOBILE)]],
      shopName: ['', Validators.required],
      address: ['', Validators.required],
      statusCode: [null, Validators.required],
    });
  }

  protected onAddCustomerForm(): void {
    this.customers.push(this.createCustomerForm());
  }

  protected onRemoveCustomer(i: number): void {
    this.customers.removeAt(i);
  }

  protected onSubmit(): void {
    if (!onValidate(this.customerForm)) return;

    const { routeId, customers } = this.customerForm.value;

    if (this.action === ActionButton.ADD) {
      this.addCustomer(routeId, customers);
    } else {
      this.updateCustomer(routeId, [
        {
          ...customers[0],
          customerId: this.customer?.customerId,
        },
      ]);
    }
  }

  private addCustomer(routeId: number, data: ICustomer[]): void {
    this.customerService
      .addCustomer(routeId, data)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.tableRefresh.emit();
            this.onCloseModal();
            alertSuccess({
              title: RESPONSE_TITLES.SUCCESS,
              text:
                res.body.message || RESPONSE_MESSAGES.CUSTOMER_ADD_EDIT_SUCCESS,
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

  private updateCustomer(routeId: number, data: ICustomer[]): void {
    this.customerService
      .updateCustomer(routeId, data)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.tableRefresh.emit();
            this.onCloseModal();
            alertSuccess({
              title: RESPONSE_TITLES.SUCCESS,
              text:
                res.body.message || RESPONSE_MESSAGES.CUSTOMER_ADD_EDIT_SUCCESS,
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
