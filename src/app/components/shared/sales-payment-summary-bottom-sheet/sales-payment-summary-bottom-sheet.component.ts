import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { BillStatus } from 'src/app/enums/BillStatus.enum';
import { ICustomerData } from 'src/app/interfaces/ICustomerData';
import { IPaymentSummary } from 'src/app/interfaces/IPaymentSummary';
import { IResponse } from 'src/app/interfaces/IResponse';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { SaleService } from 'src/app/services/sale/sale.service';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { BaseBottomSheetDirective } from 'src/app/utility/directives/base-bottom-sheet.directive';
import { alertError, errorMessageHandler } from 'src/app/utility/helper';

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

  printStatus() {
    window.print();
  }
}
