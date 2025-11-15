import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from 'src/app/interfaces/IResponse';
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
  selector: 'app-route-view',
  templateUrl: './route-view.component.html',
  styleUrls: ['./route-view.component.scss'],
})
export class RouteViewComponent
  extends ModalControlDirective
  implements OnInit
{
  @Input() public route: any;

  protected routeForm: FormGroup;

  protected statusList: Record<string, string>[] = UserStatus;

  constructor(
    private readonly fb: FormBuilder,
    private readonly routeService: RouteService
  ) {
    super();
    this.createForm();
  }

  ngOnInit() {
    if (this.route) {
      this.routeForm.patchValue(this.route);
    }
  }

  protected createForm(): void {
    this.routeForm = this.fb.group({
      routeName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }

  protected onSubmit(): void {
    if (!onValidate(this.routeForm)) return;

    this.routeService
      .addRoute(this.routeForm.value)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            alertSuccess(
              {
                title: RESPONSE_TITLES.SUCCESS,
                text:
                  res.body.message || RESPONSE_MESSAGES.ROUTE_ADD_EDIT_SUCCESS,
              },
              () => this.onCloseModal()
            );
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
