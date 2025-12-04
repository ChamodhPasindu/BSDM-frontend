import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PaginationType } from 'src/app/enums/PaginationType.enum';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IProductData } from 'src/app/interfaces/IProductData';
import { IResponse } from 'src/app/interfaces/IResponse';
import { IStock } from 'src/app/interfaces/IStock';
import { IStockCart } from 'src/app/interfaces/IStockCart';
import { ProductService } from 'src/app/services/product/product.service';
import { StockService } from 'src/app/services/stock/stock.service';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { ModalControlDirective } from 'src/app/utility/directives/modal-control.directive';
import {
  alertError,
  alertSuccess,
  errorMessageHandler,
} from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.scss'],
})
export class AddStockComponent extends ModalControlDirective implements OnInit {
  protected readonly PaginationType = PaginationType;
  protected productList: IProductData[];

  protected currentPage: number = 1;
  protected pageSize: number = 5;
  protected count: number = 0;

  protected inputSearchValue: string;
  protected inputStockRemarkValue: string;

  protected selectedProduct: IProductData | null = null;
  protected cartItems: IStockCart[] = [];

  protected productDetailForm: FormGroup;
  protected openedIndex: number | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly productService: ProductService,
    private readonly stockService: StockService
  ) {
    super();
    this.createForm();
  }

  ngOnInit(): void {
    this.loadProductListData();
  }

  private createForm(): void {
    this.productDetailForm = this.fb.group({
      quantity: [''],
      reason: ['', [Validators.required]],
    });
    this.setForm(this.productDetailForm);
  }

  private loadProductListData(): void {
    const paginationRequest: IPagination = {
      pageable: true,
      page: this.currentPage - 1,
      size: this.pageSize,
    };

    this.productService
      .getProductList(paginationRequest, this.inputSearchValue || '')
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.productList = res.body.content.content || [];
            this.count = res.body.content.totalElements || 0;
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

  protected onSearch(): void {
    this.currentPage = 1;
    this.loadProductListData();
  }

  protected goToPage(page: number): void {
    this.currentPage = page;
    this.loadProductListData();
  }

  protected onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadProductListData();
  }

  protected onSelectProduct(product: IProductData, index: number): void {
    this.openedIndex = index;
    this.selectedProduct = product;

    this.productDetailForm.reset();
    const maxQty = product.remainingQuantity ?? 0;

    this.productDetailForm
      .get('quantity')
      ?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(maxQty),
      ]);

    this.productDetailForm.get('quantity')?.updateValueAndValidity();
  }

  protected onAddToCart(): void {
    const { quantity, reason } = this.productDetailForm.value;
    if (this.selectedProduct) {
      this.cartItems.push({
        product: this.selectedProduct,
        quantity: quantity,
        reason: reason,
      });
      this.selectedProduct = null;
    }

    this.openedIndex = null;
  }

  protected onRemoveFromCart(index: number) {
    this.cartItems.splice(index, 1);
  }

  protected onSubmit(): void {
    const dataList: IStock[] = this.cartItems.map((item) => {
      return {
        productId: item.product.productId,
        batchId: item.product.batchId,
        quantity: item.quantity,
        reason: item.reason,
      };
    });
    this.stockService
      .addStock(dataList, this.inputStockRemarkValue)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.tableRefresh.emit();
            this.onCloseModal();
            alertSuccess({
              title: RESPONSE_TITLES.SUCCESS,
              text:
                res.body.message || RESPONSE_MESSAGES.STOCK_ADD_EDIT_SUCCESS,
            });
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.STOCK_ADD_EDIT_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }
}
