import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { CommonCode } from 'src/app/enums/CommonCode.enum';
import { IResponse } from 'src/app/interfaces/IResponse';
import { IRoute } from 'src/app/interfaces/IRoute';
import { IRouteData } from 'src/app/interfaces/IRouteData';
import { GeneralService } from 'src/app/services/general/general.service';
import { RouteService } from 'src/app/services/route/route.service';
import { UserStatus } from 'src/app/utility/constants/other-constant';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { ModalControlDirective } from 'src/app/utility/directives/modal-control.directive';
import {
  alertError,
  alertSuccess,
  errorMessageHandler,
  onValidate,
} from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-add-edit-view-route',
  templateUrl: './add-edit-view-route.component.html',
  styleUrls: ['./add-edit-view-route.component.scss'],
})
export class AddEditViewRouteComponent
  extends ModalControlDirective
  implements OnInit
{
  protected readonly ActionButton = ActionButton;

  private _route: IRouteData | undefined;
  private _action: ActionButton;

  protected routeForm: FormGroup;

  protected statusList: Record<string, string | number>[];

  @Input()
  public set route(value: IRouteData | undefined) {
    this._route = value;
    this.updateForm();
  }

  public get route() {
    return this._route;
  }

  @Input()
  public set action(value: ActionButton) {
    this._action = value;
    this.updateForm();
  }

  public get action() {
    return this._action;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly routeService: RouteService,
    private readonly generalService: GeneralService
  ) {
    super();
    this.createForm();
  }

  ngOnInit(): void {}

  public loadData(): void {
    this.generalService
      .getStatusList(CommonCode.ROUTES)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.statusList = res.body.content.dropdown;
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

  private createForm(): void {
    this.routeForm = this.fb.group({
      routeName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: [null, [Validators.required]],
    });
    this.setForm(this.routeForm);
  }

  private updateForm(): void {
    if (!this.action) return;

    if (this.action === ActionButton.VIEW) {
      this.patchValue();
      this.routeForm.disable();
    }

    if (this.action === ActionButton.EDIT) {
      this.patchValue();
      this.routeForm.enable();
    }

    if (this.action === ActionButton.ADD) {
      this.routeForm.enable();
    }
  }

  private patchValue(): void {
    this.routeForm.patchValue({
      routeName: this.route?.routeName,
      description: this.route?.description,
      status: this.route?.statusCode,
    });
  }

  protected onSubmit(): void {
    if (!onValidate(this.routeForm)) return;

    if (this.action === ActionButton.ADD) {
      this.addRoute(this.routeForm.value);
    } else {
      this.updateRoute({
        ...this.routeForm.value,
        routeId: this.route?.routeId,
      });
    }
  }

  private addRoute(data: IRoute): void {
    this.routeService
      .addRoute(data)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.tableRefresh.emit();
            this.onCloseModal();
            alertSuccess({
              title: RESPONSE_TITLES.SUCCESS,
              text:
                res.body.message || RESPONSE_MESSAGES.ROUTE_ADD_EDIT_SUCCESS,
            });
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.ROUTE_ADD_EDIT_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private updateRoute(data: IRoute): void {
    this.routeService
      .updateRoute(data)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.tableRefresh.emit();
            this.onCloseModal();
            alertSuccess({
              title: RESPONSE_TITLES.SUCCESS,
              text:
                res.body.message || RESPONSE_MESSAGES.ROUTE_ADD_EDIT_SUCCESS,
            });
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.ROUTE_ADD_EDIT_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }
}
