import { Component, OnInit } from '@angular/core';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { SalesPaymentSummaryBottomSheetComponent } from '../sales-payment-summary-bottom-sheet/sales-payment-summary-bottom-sheet.component';

@Component({
  selector: 'app-pay-now-bottom-sheet',
  templateUrl: './sales-pay-now-bottom-sheet.component.html',
  styleUrls: ['./sales-pay-now-bottom-sheet.component.scss'],
})
export class SalesPayNowBottomSheetComponent implements OnInit {
  constructor(private bottomSheetService: NgxBottomSheetService) {}

  ngOnInit() {}

  customer = {
    name: 'Chamodh Pasindu',
    shopName: 'CP Traders',
    address: 'Colombo 05',
    overdueAmount: 12345,
  };

  bill = {
    id: 'BILL-1001',
    date: new Date(),
    total: 25000,
  };

  paymentAmount: number | null = null;
  paymentStatus = '';
  note = '';

  checkPaymentType() {
    if (this.paymentAmount == null) {
      this.paymentStatus = '';
      return;
    }

    if (this.paymentAmount < this.bill.total) {
      this.paymentStatus = 'Partial Payment';
    } else if (this.paymentAmount === this.bill.total) {
      this.paymentStatus = 'Full Payment';
    } else {
      this.paymentStatus = 'Excess Payment (Check again)';
    }
  }

  markAsSettled() {
    // Handle payment submission
    console.log('Payment settled:', {
      amount: this.paymentAmount,
      note: this.note,
      type: this.paymentStatus,
    });

    this.bottomSheetService.close();
    this.bottomSheetService.open(SalesPaymentSummaryBottomSheetComponent, {
      height: 'top',
      backgroundColor: '#fff',
      showCloseButton:false
    });
  }
}
