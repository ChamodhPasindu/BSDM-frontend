import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
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
import { alertError, alertSuccess, errorMessageHandler, onValidate } from 'src/app/utility/helper';

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

  protected paymentDetail: IPaymentDetail | null;
  protected paymentForm: FormGroup;

  @Output() paymentSettled = new EventEmitter<void>();

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
    private readonly fb: FormBuilder
  ) {
    super();
    this.createForm();
  }

  protected override resetState(): void {
    this.paymentDetail = null;
    this.paymentForm.reset();
  }

  ngOnInit() {}

  private createForm(): void {
    this.paymentForm = this.fb.group({
      settlementAmount: ['', Validators.required],
      paymentReason: [''],
    });
  }

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
            this.paymentDetail = res.body.content;
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

  private updateForm(): void {
    if (!this.action) return;

    if (this.action === ActionButton.EDIT && this.paymentDetail) {
      // Set max validation for settlement amount
      const balanceAmount = this.paymentDetail.orderBalanceAmount;
      this.paymentForm.get('settlementAmount')?.setValidators([
        Validators.required,
        Validators.min(balanceAmount),
        Validators.max(balanceAmount)
      ]);
      this.paymentForm.get('settlementAmount')?.updateValueAndValidity();
    }
  }

  protected onSubmit(): void {
    if (!onValidate(this.paymentForm) || !this.paymentDetail) return;

    const { settlementAmount, paymentMethod, paymentReason } = this.paymentForm.value;

    const paymentData = {
      orderId: this.paymentDetail.orderId,
      paidAmount: settlementAmount,
      paymentMethod: paymentMethod,
      paymentReason: paymentReason || '',
    };

    // this.paymentService
    //   .settlePayment(paymentData)
    //   .pipe(untilDestroyed(this))
    //   .subscribe({
    //     next: (res: IResponse) => {
    //       if (res.body.status === RSP_SUCCESS) {
    //         alertSuccess({
    //           title: RESPONSE_TITLES.SUCCESS,
    //           text: res.body.message || 'Payment settled successfully',
    //         });
    //         this.paymentSettled.emit();
    //         this.onCloseModal();
    //       } else {
    //         alertError({
    //           title: RESPONSE_TITLES.FAILED,
    //           text: res.body.message || RESPONSE_MESSAGES.COMMON_ERROR_DES,
    //         });
    //       }
    //     },
    //     error: (err: HttpErrorResponse) => errorMessageHandler(err),
    //   });
  }
}
