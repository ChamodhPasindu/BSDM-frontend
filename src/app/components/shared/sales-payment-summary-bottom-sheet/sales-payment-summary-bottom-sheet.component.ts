import { Component, OnInit } from '@angular/core';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { ICustomerData } from 'src/app/interfaces/ICustomerData';
import { IPayment } from 'src/app/interfaces/IPayment';
import { IProductData } from 'src/app/interfaces/IProductData';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { ProductService } from 'src/app/services/product/product.service';
import { SaleService } from 'src/app/services/sale/sale.service';
import { BaseBottomSheetDirective } from 'src/app/utility/directives/base-bottom-sheet.directive';

@Component({
  selector: 'app-sales-payment-summary',
  templateUrl: './sales-payment-summary-bottom-sheet.component.html',
  styleUrls: ['./sales-payment-summary-bottom-sheet.component.scss'],
})
export class SalesPaymentSummaryBottomSheetComponent
  extends BaseBottomSheetDirective
  implements OnInit
{
  protected customerDetails: Partial<ICustomerData> | null = null;
  protected productList: IProductData[] = [];
  protected saleCompleteData: Record<string, string> | null = null;
  protected paymentCompleteData: IPayment | null = null;

  constructor(
    public override readonly bottomSheetService: NgxBottomSheetService,
    private readonly customerService: CustomerService,
    private readonly productService: ProductService,
    private readonly saleService: SaleService,
    private readonly paymentService: PaymentService
  ) {
    super(bottomSheetService);
  }

  ngOnInit(): void {
    this.customerDetails = this.customerService.getSelectedCustomer();
    this.productList = this.productService.getSelectedProductList();
    this.saleCompleteData = this.saleService.getSaleCompleteData();
    this.paymentCompleteData = this.paymentService.getPaymentCompleteData();
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
