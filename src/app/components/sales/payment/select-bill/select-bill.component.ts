import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { SalesPayNowBottomSheetComponent } from 'src/app/components/shared/sales-pay-now-bottom-sheet/sales-pay-now-bottom-sheet.component';
import { SalesPaymentSummaryBottomSheetComponent } from 'src/app/components/shared/sales-payment-summary-bottom-sheet/sales-payment-summary-bottom-sheet.component';
import { BillStatus } from 'src/app/enums/BillStatus.enum';
import { IBillData } from 'src/app/interfaces/IBillData';
import { ICustomerData } from 'src/app/interfaces/ICustomerData';
import { ICustomizeRouteData } from 'src/app/interfaces/ICustomizeRouteData';
import { IResponse } from 'src/app/interfaces/IResponse';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { RouteService } from 'src/app/services/route/route.service';
import { SaleService } from 'src/app/services/sale/sale.service';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { alertError, errorMessageHandler } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-select-bill',
  templateUrl: './select-bill.component.html',
  styleUrls: ['./select-bill.component.scss'],
})
export class SelectBillComponent implements OnInit {
  protected readonly BillStatus = BillStatus;
  protected routeDetails: ICustomizeRouteData | null = null;
  protected customerDetails: Partial<ICustomerData> | null = null;

  protected billList: IBillData[] = [];
  protected filteredBillList: IBillData[] = [];
  protected billSearchTerm: string;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly bottomSheetService: NgxBottomSheetService,
    private readonly routeService: RouteService,
    private readonly customerService: CustomerService,
    private readonly saleService: SaleService,
    private readonly paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.routeDetails = this.routeService.getSelectedRoute();
    this.customerDetails = this.customerService.getSelectedCustomer();

    if (!this.routeDetails || !this.customerDetails) {
      this.router.navigate(['../select-route'], {
        relativeTo: this.route,
      });
    }

    this.loadBillList();
  }

  private loadBillList(): void {
    this.paymentService
      .getBillList(
        this.customerDetails?.customerId!,
        this.routeDetails?.routeId!
      )
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.billList = res.body.content;
            this.filteredBillList = this.billList;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.ORDER_BILL_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  protected filterBills(): void {
    const term = this.billSearchTerm.toLowerCase();
    this.filteredBillList = this.billList.filter(
      (bill) =>
        bill.orderReferenceNumber.toLowerCase().includes(term) ||
        bill.paymentStatus.toLowerCase().includes(term) ||
        bill.orderAmount.toString().includes(term)
    );
  }

  protected viewBill(bill: IBillData): void {
    this.paymentService.setSelectedBill(bill);

    const saleCompleteData: Record<string, string> = {
      orderTotalAmount: bill.orderAmount.toString(),
      orderReferenceNumber: bill.orderReferenceNumber,
      orderDate: bill.orderDate,
    };

    this.saleService.setSaleCompleteData(saleCompleteData);

    if (bill.paymentStatus === BillStatus.PENDING) {
      this.bottomSheetService
        .open(SalesPayNowBottomSheetComponent, {
          height: '515px',
          showCloseButton: false,
          backgroundColor: '#fff',
        })
        .afterClosed$.subscribe((result) => {
          if (result?.action) {
            this.loadBillList();
          }
        });
    } else {
      this.bottomSheetService.open(SalesPaymentSummaryBottomSheetComponent, {
        height: 'top',
        showCloseButton: false,
        backgroundColor: '#fff',
      });
    }
  }
}
