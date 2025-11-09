import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { SalesPayNowBottomSheetComponent } from 'src/app/shared/sales-pay-now-bottom-sheet/sales-pay-now-bottom-sheet.component';
import { SalesPaymentSummaryBottomSheetComponent } from 'src/app/shared/sales-payment-summary-bottom-sheet/sales-payment-summary-bottom-sheet.component';

@Component({
  selector: 'app-select-bill',
  templateUrl: './select-bill.component.html',
  styleUrls: ['./select-bill.component.scss'],
})
export class SelectBillComponent  {
  billSearchTerm = '';
  bills = [
    { id: 'B001', date: new Date('2025-10-25'), status: 'Full Paid' },
    { id: 'B002', date: new Date('2025-10-28'), status: 'Partial Paid' },
    { id: 'B003', date: new Date('2025-11-01'), status: 'Not Paid' },
  ];
  filteredBills = [...this.bills];

  constructor(private router: Router,private bottomSheetService: NgxBottomSheetService) {}

  filterBills() {
    const term = this.billSearchTerm.toLowerCase();
    this.filteredBills = this.bills.filter((bill) =>
      bill.id.toLowerCase().includes(term)
    );
  }

  viewBill(bill: any) {
    if(bill.status === 'Not Paid'){
      this.bottomSheetService.open(SalesPayNowBottomSheetComponent, {
        height: '515px',
        showCloseButton: false,
        backgroundColor: '#fff',
      });
    }else{
      this.bottomSheetService.open(SalesPaymentSummaryBottomSheetComponent, {
        height: 'top',
        showCloseButton: false,
        backgroundColor: '#fff',
      });
    }
    
  }
}
