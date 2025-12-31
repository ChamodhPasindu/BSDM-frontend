import { Component, OnInit } from '@angular/core';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { SalesPaymentSummaryBottomSheetComponent } from '../sales-payment-summary-bottom-sheet/sales-payment-summary-bottom-sheet.component';
import { BaseBottomSheetDirective } from 'src/app/utility/directives/base-bottom-sheet.directive';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { SaleService } from 'src/app/services/sale/sale.service';
import { ICustomerData } from 'src/app/interfaces/ICustomerData';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { IPayment } from 'src/app/interfaces/IPayment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from 'src/app/interfaces/IResponse';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import { alertError, errorMessageHandler } from 'src/app/utility/helper';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { HttpErrorResponse } from '@angular/common/http';

@UntilDestroy()
@Component({
  selector: 'app-pay-now-bottom-sheet',
  templateUrl: './sales-pay-now-bottom-sheet.component.html',
  styleUrls: ['./sales-pay-now-bottom-sheet.component.scss'],
})
export class SalesPayNowBottomSheetComponent
  extends BaseBottomSheetDirective
  implements OnInit
{
  protected customerDetails: Partial<ICustomerData> | null = null;
  protected saleCompleteData: Record<string, string> | null = null;
  protected today = new Date();

  protected paymentAmount: number | null = null;
  protected paymentStatus: string = '';
  protected note: string = '';

  constructor(
    public override readonly bottomSheetService: NgxBottomSheetService,
    private readonly customerService: CustomerService,
    private readonly saleService: SaleService,
    private readonly paymentService: PaymentService
  ) {
    super(bottomSheetService);
  }

  ngOnInit(): void {
    this.customerDetails = this.customerService.getSelectedCustomer();
    this.saleCompleteData = this.saleService.getSaleCompleteData();

    // this.saleService
    //   .getOrderSummary(this.saleCompleteData?.['orderReferenceNumber']!)
    //   .pipe(untilDestroyed(this))
    //   .subscribe({
    //     next: (res: IResponse) => {
    //       if (res.body.status === RSP_SUCCESS) {
    //       } else {
    //         alertError({
    //           title: RESPONSE_TITLES.FAILED,
    //           text: res.body.message || RESPONSE_MESSAGES.PAYMENT_SETTLE_FAILED,
    //         });
    //       }
    //     },
    //     error: (err: HttpErrorResponse) => {
    //       errorMessageHandler(err);
    //     },
    //   });
  }

  protected checkPaymentType(): void {
    const maxAmount = Number(this.saleCompleteData?.['orderTotalAmount']!);
    const minAmount = maxAmount / 2;

    if (this.paymentAmount! === maxAmount) {
      this.paymentStatus = 'Full Payment';
    } else if (
      this.paymentAmount! >= minAmount &&
      this.paymentAmount! < maxAmount
    ) {
      this.paymentStatus = 'Partial Payment';
    } else if (this.paymentAmount! > maxAmount) {
      this.paymentStatus = 'Amount exceeds total bill';
    } else {
      this.paymentStatus = 'Minimum payment is 50% of total amount';
    }
  }

  protected markAsSettled(): void {
    const payload: IPayment = {
      paidAmount: this.paymentAmount!,
      paymentMethod: 'Cash',
      referenceNumber: this.saleCompleteData?.['orderReferenceNumber']!,
      paymentReason: this.note,
    };

    this.paymentService
      .settlePayment(payload)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.paymentService.setPaymentCompleteData(payload);
            this.bottomSheetService.close({ action: true });
            this.bottomSheetService.open(
              SalesPaymentSummaryBottomSheetComponent,
              {
                height: 'top',
                backgroundColor: '#fff',
                showCloseButton: false,
              }
            );
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.PAYMENT_SETTLE_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }
}
