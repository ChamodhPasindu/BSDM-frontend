import { Component, OnInit } from '@angular/core';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { BillSummaryComponent } from '../bill-summary/bill-summary.component';
import { SaleService } from 'src/app/services/sale/sale.service';
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
    private readonly productService: ProductService
  ) {}

  ngOnInit(): void {
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
            this.productList = res.body.content.map((p: IProductData) => ({
              ...p,
              selected: false,
              selectedQuantity: 0,
              selectedPrice: p.price,
            }));
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

  protected increaseQty(product: IProductData): void {
    if (product.selectedQuantity! < product.availableQuantity) {
      product.selectedQuantity! += 1;
      product.selected = true;
    }
  }

  protected decreaseQty(product: IProductData): void {
    if (product.selectedQuantity! > 0) {
      product.selectedQuantity! -= 1;
    }

    if (product.selectedQuantity === 0) {
      product.selected = false;
    }
  }

  protected getTotalAmount(): number {
    return this.filteredProductList
      .filter((p: IProductData) => p.selected)
      .reduce((sum, p) => sum + (p.selectedQuantity * p.selectedPrice || 0), 0);
  }

  protected getSelectedCount(): number {
    return this.filteredProductList.filter(
      (p) => p.selected && p.selectedQuantity > 0
    ).length;
  }

  protected toggleBottomSheet() {
    const selectedProductList = this.filteredProductList.filter(
      (product: IProductData) => product.selected
    );

    this.productService.setSelectedProductList(selectedProductList);

    this.bottomSheetService.open(BillSummaryComponent, {
      height: 'top',
      showCloseButton: false,
      backgroundColor: '#fff',
    });
  }

  protected hasValidSelectedProducts(): boolean {
    const selected = this.filteredProductList.filter(
      (p) => p.selected && p.selectedQuantity > 0
    );

    if (!selected.length) return false;

    return selected.every((product) => {
      const price = Number(product.selectedPrice);
      return (
        !isNaN(price) &&
        price >= product.minSalesPrice &&
        price <= product.price
      );
    });
  }
}
