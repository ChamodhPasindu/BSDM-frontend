import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { BillStatus } from 'src/app/enums/BillStatus.enum';
import { ICustomerData } from 'src/app/interfaces/ICustomerData';
import { IPaymentSalesman } from 'src/app/interfaces/IPaymentSalesman';
import { IPaymentSummary } from 'src/app/interfaces/IPaymentSummary';
import { IResponse } from 'src/app/interfaces/IResponse';
import { BottomSheetEventService } from 'src/app/services/bottom-sheet/bottom-sheet-event.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { SaleService } from 'src/app/services/sale/sale.service';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { BaseBottomSheetDirective } from 'src/app/utility/directives/base-bottom-sheet.directive';
import {
  alertError,
  alertSuccess,
  alertWarning,
  errorMessageHandler,
} from 'src/app/utility/helper';
import { SweetAlertResult } from 'sweetalert2';

@UntilDestroy()
@Component({
  selector: 'app-sales-payment-summary',
  templateUrl: './sales-payment-summary-bottom-sheet.component.html',
  styleUrls: ['./sales-payment-summary-bottom-sheet.component.scss'],
})
export class SalesPaymentSummaryBottomSheetComponent
  extends BaseBottomSheetDirective
  implements OnInit
{
  protected readonly BillStatus = BillStatus;

  protected customerDetails: Partial<ICustomerData> | null = null;
  protected saleCompleteData: Record<string, string> | null = null;

  protected paymentSummaryData: IPaymentSummary | null = null;

  constructor(
    public override readonly bottomSheetService: NgxBottomSheetService,
    private readonly bottomSheetEventService: BottomSheetEventService,
    private readonly customerService: CustomerService,
    private readonly saleService: SaleService,
    private readonly paymentService: PaymentService
  ) {
    super(bottomSheetService);
  }

  ngOnInit(): void {
    this.customerDetails = this.customerService.getSelectedCustomer();
    this.saleCompleteData = this.saleService.getSaleCompleteData();

    this.loadPaymentSummaryData();
  }

  protected loadPaymentSummaryData(): void {
    this.paymentService
      .getPaymentSummary(this.saleCompleteData?.['orderReferenceNumber']!)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.paymentSummaryData = res.body.content;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.PAYMENT_SUMMARY_GET_FAILED,
            });
            this.bottomSheetService.close();
          }
        },
        error: (err: HttpErrorResponse) => {
          this.bottomSheetService.close();
          errorMessageHandler(err);
        },
      });
  }

  protected settleOverdue(): void {
    alertWarning(
      {
        title: RESPONSE_TITLES.WARNING,
        text: RESPONSE_MESSAGES.PAYMENT_OVERDUE_SETTLE_CONFIRMATION,
      },
      (result: SweetAlertResult<any>) => {
        if (result.isConfirmed) {
          const payload: IPaymentSalesman = {
            paidAmount: this.paymentSummaryData?.needToPay!,
            paymentMethod: 'Cash',
            referenceNumber: this.saleCompleteData?.['orderReferenceNumber']!,
            paymentReason: 'Direct Overdue Settlement',
          };

          this.paymentService
            .salesmanSettlePayment(payload)
            .pipe(untilDestroyed(this))
            .subscribe({
              next: (res: IResponse) => {
                if (res.body.status === RSP_SUCCESS) {
                  this.bottomSheetEventService.emitClose({action:'payment-summary'});
                  this.bottomSheetService.close();
                  alertSuccess({
                    title: RESPONSE_TITLES.SUCCESS,
                    text: RESPONSE_MESSAGES.PAYMENT_OVERDUE_SETTLE_SUCCESS,
                  });
                } else {
                  alertError({
                    title: RESPONSE_TITLES.FAILED,
                    text:
                      res.body.message ||
                      RESPONSE_MESSAGES.PAYMENT_SETTLE_FAILED,
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

  printStatus() {
    window.print();
  }
}
