import { Component, OnInit } from '@angular/core';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { BaseBottomSheetDirective } from 'src/utils/directives/base-bottom-sheet.directive';

@Component({
  selector: 'app-sales-payment-summary',
  templateUrl: './sales-payment-summary-bottom-sheet.component.html',
  styleUrls: ['./sales-payment-summary-bottom-sheet.component.scss'],
})
export class SalesPaymentSummaryBottomSheetComponent extends BaseBottomSheetDirective {
  constructor(public override bottomSheetService: NgxBottomSheetService) {
    super(bottomSheetService);
  }

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
    status: 'Partial Payment',
    items: [
      { name: 'Rice 10kg', qty: 2, total: 14000 },
      { name: 'Sugar 5kg', qty: 1, total: 5000 },
      { name: 'Tea Pack', qty: 3, total: 6000 },
    ],
    payments: [
      { date: new Date('2025-11-01'), amount: 15000 },
      { date: new Date('2025-11-05'), amount: 5000 },
    ],
  };

  get totalPaid(): number {
    return this.bill.payments.reduce((sum, p) => sum + p.amount, 0);
  }

  printStatus() {
    window.print();
  }
}
