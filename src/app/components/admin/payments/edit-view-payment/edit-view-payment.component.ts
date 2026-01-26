import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { BillStatus } from 'src/app/enums/BillStatus.enum';
import { IPaymentAdmin } from 'src/app/interfaces/IPaymentAdmin';
import { IPaymentData } from 'src/app/interfaces/IPaymentData';
import { IPaymentDetail } from 'src/app/interfaces/IPaymentDetail';
import { IResponse } from 'src/app/interfaces/IResponse';
import { PaymentService } from 'src/app/services/payment/payment.service';
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
  selector: 'app-edit-view-payment',
  templateUrl: './edit-view-payment.component.html',
  styleUrls: ['./edit-view-payment.component.scss'],
})
export class EditViewPaymentComponent extends ModalControlDirective {
  protected readonly ActionButton = ActionButton;
  protected readonly BillStatus = BillStatus;

  private _payment: IPaymentData | undefined;
  private _action: ActionButton;

  protected paymentDetail: IPaymentDetail | null;
  protected paymentForm: FormGroup;

  @Input()
  public set payment(value: IPaymentData | undefined) {
    this._payment = value;
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

  constructor(
    private readonly paymentService: PaymentService,
    private readonly fb: FormBuilder,
  ) {
    super();
    this.createForm();
  }

  protected override resetState(): void {
    this.paymentDetail = null;
    this.paymentForm.reset();
  }

  private createForm(): void {
    this.paymentForm = this.fb.group({
      settlementAmount: ['', Validators.required],
      paymentReason: [''],
    });
  }

  public loadData(): void {
    this.getPaymentData();
  }

  private getPaymentData(): void {
    this.paymentService
      .getPaymentById(this.payment?.paymentId!)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.paymentDetail = res.body.content;
            this.updateForm();
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.PAYMENT_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => errorMessageHandler(err),
      });
  }

  private updateForm(): void {
    if (!this.action) return;

    if (this.action === ActionButton.EDIT && this.paymentDetail) {
      // Set max validation for settlement amount
      const balanceAmount = this.paymentDetail.orderBalanceAmount;
      this.paymentForm
        .get('settlementAmount')
        ?.setValidators([
          Validators.required,
          Validators.min(balanceAmount),
          Validators.max(balanceAmount),
        ]);
      this.paymentForm.get('settlementAmount')?.updateValueAndValidity();
    }
  }

  protected onSubmit(): void {
    if (!onValidate(this.paymentForm) || !this.paymentDetail) return;

    const { settlementAmount, paymentReason } = this.paymentForm.value;

    const payload: IPaymentAdmin = {
      orderId: this.paymentDetail.orderId.toString(),
      paidAmount: settlementAmount,
      orderReferenceNumber: this.paymentDetail.orderReferenceNumber,
      paymentId: this.paymentDetail.paymentId.toString(),
    };

    this.paymentService
      .adminSettlePayment(payload)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.tableRefresh.emit();
            this.onCloseModal();
            alertSuccess({
              title: RESPONSE_TITLES.SUCCESS,
              text:
                res.body.message || RESPONSE_MESSAGES.PAYMENT_ADD_EDIT_SUCCESS,
            });
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message || RESPONSE_MESSAGES.PAYMENT_ADD_EDIT_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => errorMessageHandler(err),
      });
  }
}
