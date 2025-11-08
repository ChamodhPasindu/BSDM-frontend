import { Component, OnInit } from '@angular/core';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { SalesPaymentSummaryBottomSheetComponent } from 'src/app/shared/sales-payment-summary-bottom-sheet/sales-payment-summary-bottom-sheet.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  totalCollapseVisible = false;

  toggleTotalCollapse() {
    this.totalCollapseVisible = !this.totalCollapseVisible;
  }
  constructor(private bottomSheetService: NgxBottomSheetService) {}

  ngOnInit() {}

  products = [
    { name: 'Sunlight Soap', description: '250g pack', quantity: 24 },
    { name: 'Lifebuoy Shampoo', description: '100ml bottle', quantity: 12 },
    { name: 'Anchor Milk Powder', description: '1kg pack', quantity: 8 },
    { name: 'Milo Drink', description: '200ml can', quantity: 15 },
  ];

  openLatestPayment() {
    this.bottomSheetService.open(SalesPaymentSummaryBottomSheetComponent, {
      height: 'top',
      backgroundColor: '#fff',
      showCloseButton:false
    });
  }
}
