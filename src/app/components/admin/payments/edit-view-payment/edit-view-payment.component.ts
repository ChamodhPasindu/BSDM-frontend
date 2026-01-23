import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { IPaymentData } from 'src/app/interfaces/IPaymentData';
import { IResponse } from 'src/app/interfaces/IResponse';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { ModalControlDirective } from 'src/app/utility/directives/modal-control.directive';
import { alertError, errorMessageHandler } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-edit-view-payment',
  templateUrl: './edit-view-payment.component.html',
  styleUrls: ['./edit-view-payment.component.scss'],
})
export class EditViewPaymentComponent
  extends ModalControlDirective
  implements OnInit
{
  protected readonly ActionButton = ActionButton;

  private _payment: IPaymentData | undefined;
  private _action: ActionButton;

  @Input()
  public set payment(value: IPaymentData | undefined) {
    this._payment = value;
    this.updateForm();
  }

  public get payment() {
    return this._payment;
  }

  @Input()
  public set action(value: ActionButton) {
    this._action = value;
  }

  public get action() {
    return this._action;
  }

  constructor(private readonly paymentService: PaymentService) {
    super();
  }

  protected override resetState(): void {}

  ngOnInit() {}

  public loadData(): void {
    this.getPaymentDetails();
  }

  private getPaymentDetails(): void {
    this.paymentService
      .getPaymentById(this.payment?.paymentId!)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
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

  private updateForm(): void {
    if (!this.action) return;

    if (this.action === ActionButton.VIEW) {
      // this.patchValue();
      // this.employeeForm.disable();
    }

    if (this.action === ActionButton.EDIT) {
      // this.patchValue();
      // this.employeeForm.enable();
    }
  }
}
