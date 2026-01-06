import { Component, OnInit } from '@angular/core';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from 'src/app/interfaces/IResponse';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  alertError,
  alertSuccess,
  errorMessageHandler,
} from 'src/app/utility/helper';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from 'src/app/services/product/product.service';
import { IProductData } from 'src/app/interfaces/IProductData';
import { Router } from '@angular/router';
import { SaleService } from 'src/app/services/sale/sale.service';
import { IDraftOrder } from 'src/app/interfaces/IDraftOrder';

@UntilDestroy()
@Component({
  selector: 'app-easy-order',
  templateUrl: './easy-order.component.html',
  styleUrls: ['./easy-order.component.scss'],
})
export class EasyOrderComponent implements OnInit {
  protected productList: IProductData[] = [];
  protected filteredProductList: IProductData[] = [];
  protected productSearchTerm: string = '';

  constructor(
    private readonly router: Router,
    private readonly bottomSheetService: NgxBottomSheetService,
    private readonly productService: ProductService,
    private readonly saleService: SaleService
  ) {}

  ngOnInit(): void {
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

  protected toggleProductSelection(product: IProductData): void {
    if (product.availableQuantity === 0) return;

    product.selected = !product.selected;

    if (product.selected && !product.selectedQuantity) {
      product.selectedQuantity = 1;
    }

    if (!product.selected) {
      product.selectedQuantity = 0;
      product.selectedPrice = product.price;
    }
  }

  protected onQtyFocus(product: IProductData): void {
    product.selectedQuantity = null;
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
      product.selectedPrice = product.price;
    }
  }

  protected getTotalAmount(): number {
    return this.filteredProductList
      .filter((p: IProductData) => p.selected)
      .reduce(
        (sum, p) => sum + (p.selectedQuantity! * p.selectedPrice || 0),
        0
      );
  }

  protected getSelectedCount(): number {
    return this.filteredProductList.filter(
      (p) => p.selected && p.selectedQuantity! > 0
    ).length;
  }

  protected hasValidSelectedProducts(): boolean {
    const selected = this.filteredProductList.filter((p) => p.selected);

    if (!selected.length) return false;

    return selected.every((product) => {
      const qty = Number(product.selectedQuantity);
      const price = Number(product.selectedPrice);

      if (
        product.selectedQuantity == null ||
        product.selectedPrice == null ||
        isNaN(qty) ||
        isNaN(price)
      ) {
        return false;
      }

      return (
        qty >= 1 &&
        qty <= product.availableQuantity &&
        price >= product.minSalesPrice &&
        price <= product.price
      );
    });
  }

  protected submitEasyOrder(): void {
    const selectedProductList = this.filteredProductList.filter(
      (product: IProductData) => product.selected
    );
  }

  protected navigateToDraftOrders(): void {
    this.router.navigate(['/sales/post-login/easy-order/draft-orders']);
  }
}
