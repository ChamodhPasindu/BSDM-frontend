import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import * as moment from 'moment';
import { SalesPaymentSummaryBottomSheetComponent } from '../../shared/sales-payment-summary-bottom-sheet/sales-payment-summary-bottom-sheet.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  protected greetingText: string;
  protected currentDateTime: string;
  protected greetingImage: string = 'assets/images/morning-greetings.png';
  protected intervalId: any;

  protected totalCollapseVisible: boolean = false;
  protected billCollapseVisible = false;
  protected pendingCollapseVisible = false;
  protected stockLeftCollapseVisible = false;
  protected coveredShopCollapseVisible = false;

  constructor(private bottomSheetService: NgxBottomSheetService) {}

  ngOnInit() {
    this.updateGreeting();

    this.intervalId = setInterval(() => {
      this.updateGreeting();
    }, 60000);
  }

  protected updateGreeting() {
    const now = moment();
    const hours = now.hour();

    // Determine greeting text and image
    if (hours >= 5 && hours < 12) {
      this.greetingText = 'Good Morning!';
      this.greetingImage = 'assets/images/morning-greetings.png';
    } else if (hours >= 12 && hours < 17) {
      this.greetingText = 'Good Afternoon!';
      this.greetingImage = 'assets/images/afternoon-greetings.png';
    } else if (hours >= 17 && hours < 21) {
      this.greetingText = 'Good Evening!';
      this.greetingImage = 'assets/images/evening-greetings.png';
    } else {
      this.greetingText = 'Good Night!';
      this.greetingImage = 'assets/images/night-greetings.png';
    }

    // Format date and time using moment.js
    this.currentDateTime = now.format('MMMM DD, YYYY | hh:mm A');
  }

  protected toggleTotalCollapse() {
    this.totalCollapseVisible = !this.totalCollapseVisible;
  }

  protected toggleBillCollapse() {
    this.billCollapseVisible = !this.billCollapseVisible;
  }

  protected togglePendingCollapse() {
    this.pendingCollapseVisible = !this.pendingCollapseVisible;
  }

  protected toggleStockLeftCollapse() {
    this.stockLeftCollapseVisible = !this.stockLeftCollapseVisible;
  }

  protected toggleCoveredShopCollapse() {
    this.coveredShopCollapseVisible = !this.coveredShopCollapseVisible;
  }

  protected products = [
    { name: 'Sunlight Soap', description: '250g pack', quantity: 24 },
    { name: 'Lifebuoy Shampoo', description: '100ml bottle', quantity: 12 },
    { name: 'Anchor Milk Powder', description: '1kg pack', quantity: 8 },
    { name: 'Milo Drink', description: '200ml can', quantity: 15 },
  ];

  protected openLatestPayment() {
    this.bottomSheetService.open(SalesPaymentSummaryBottomSheetComponent, {
      height: 'top',
      backgroundColor: '#fff',
      showCloseButton: false,
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
