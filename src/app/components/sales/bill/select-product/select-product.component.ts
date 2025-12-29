import { Component, OnInit } from '@angular/core';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { BillSummaryComponent } from '../bill-summary/bill-summary.component';
import { SaleService } from 'src/app/services/sale/sale.service';
import { RouteService } from 'src/app/services/route/route.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from 'src/app/interfaces/IResponse';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import { alertError, errorMessageHandler } from 'src/app/utility/helper';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from 'src/app/services/product/product.service';
import { IProductData } from 'src/app/interfaces/IProductData';
import { ActivatedRoute, Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.component.html',
  styleUrls: ['./select-product.component.scss'],
})
export class SelectProductComponent implements OnInit {
  protected productList: IProductData[] = [];
  protected filteredProductList: IProductData[] = [];

  protected productSearchTerm: string;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly bottomSheetService: NgxBottomSheetService,
    private readonly saleService: SaleService,
    private readonly routeService: RouteService,
    private readonly customerService: CustomerService,
    private readonly productService: ProductService
  ) {}

  ngOnInit() {
    const saleInitData = this.saleService.getSaleInitData();
    if (!saleInitData) {
      this.router.navigate(['../select-route'], { relativeTo: this.route });
    }
    this.loadProductList();
  }

  private loadProductList(): void {
    this.productService
      .getSalesmanProductList()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.productList = res.body.content;
            this.filteredProductList = this.productList;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.PRODUCT_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  protected filterProducts(): void {
    const term = this.productSearchTerm.toLowerCase();
    this.filteredProductList = this.productList.filter(
      (product) =>
        product.productName.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
    );
  }

  products = [
    {
      id: 1,
      name: 'Product A',
      description: 'High-quality item',
      minPrice: 100,
      maxPrice: 150,
      qty: 0,
      selected: false,
    },
    {
      id: 2,
      name: 'Product B',
      description: 'Durable and reliable',
      minPrice: 200,
      maxPrice: 250,
      qty: 0,
      selected: false,
    },
    {
      id: 3,
      name: 'Product C',
      description: 'Best seller',
      minPrice: 150,
      maxPrice: 180,
      qty: 0,
      selected: false,
    },
  ];

  filteredProducts = [...this.products];

  // Increase quantity
  increaseQty(product: any) {
    product.qty += 1;
    if (!product.selected) product.selected = true;
  }

  // Decrease quantity
  decreaseQty(product: any) {
    if (product.qty > 0) product.qty -= 1;
    if (product.qty === 0) product.selected = false;
  }

  // Check if any product is selected
  hasSelectedProducts(): boolean {
    return this.products.some((p) => p.selected && p.qty > 0);
  }

  // Confirm Order
  confirmOrder() {
    const selectedProducts = this.products.filter(
      (p) => p.selected && p.qty > 0
    );
    console.log('Order Confirmed:', selectedProducts);
    alert('Order Confirmed!');
    // Reset products
    this.products.forEach((p) => {
      p.qty = 0;
      p.selected = false;
    });
  }

  getTotalAmount(): number {
    return this.filteredProducts
      .filter((p) => p.selected)
      .reduce((sum, p) => sum + (p.qty * p.maxPrice || 0), 0);
  }

  getSelectedCount(): number {
    return this.filteredProducts.filter((p) => p.selected && p.qty > 0).length;
  }

  toggleBottomSheet() {
    this.bottomSheetService.open(BillSummaryComponent, {
      height: 'top',
      showCloseButton: false,
      backgroundColor: '#fff',
    });
  }
}
