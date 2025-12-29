import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from 'src/app/interfaces/IResponse';
import { IReturnStock } from 'src/app/interfaces/IReturnStock';
import { StockReturnService } from 'src/app/services/stock-return/stock-return.service';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { ModalControlDirective } from 'src/app/utility/directives/modal-control.directive';
import {
  alertError,
  alertSuccess,
  alertWarning,
  errorMessageHandler,
} from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-add-return-stock',
  templateUrl: './add-return-stock.component.html',
  styleUrls: ['./add-return-stock.component.scss'],
})
export class AddReturnStockComponent
  extends ModalControlDirective
  implements OnInit
{
  protected saleStockList: Record<string, string | number>[] = [];
  protected selectedSaleStockDetailsList: Record<string, string | number>[] =
    [];
  protected selectedProduct: Record<string, string | number> | null = null;
  protected cartItems: Record<string, string>[] = [];

  protected openedIndex: number | null = null;

  protected returnStockForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly stockReturnService: StockReturnService
  ) {
    super();
    this.createForm();
  }

  ngOnInit(): void {}

  protected override resetState(): void {
    this.selectedProduct = null;
    this.cartItems = [];
  }

  public loadData(): void {
    this.loadReturnStockList();
  }

  private createForm(): void {
    this.returnStockForm = this.fb.group({
      returnQty: ['', Validators.required],
    });
    this.setForm(this.returnStockForm);
  }

  private loadReturnStockList(): void {
    this.stockReturnService
      .getReturnDropDownList()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.saleStockList = res.body.content;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message || RESPONSE_MESSAGES.RETURN_STOCK_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => errorMessageHandler(err),
      });
  }

  protected onSaleStockChange(event: Record<string, string>): void {
    this.cartItems = [];
    this.stockReturnService
      .getSaleStockDetailsById(event['code'])
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.selectedSaleStockDetailsList = res.body.content;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message || RESPONSE_MESSAGES.RETURN_STOCK_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => errorMessageHandler(err),
      });
  }

  protected onSelectProduct(
    product: Record<string, string | number>,
    index: number
  ): void {
    this.openedIndex = index;
    this.selectedProduct = product;

    this.returnStockForm.get('returnQty')?.setValue('');
    const maxQty = product['balanceQuantity'] ?? 0;

    this.returnStockForm
      .get('returnQty')
      ?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(Number(maxQty)),
      ]);

    this.returnStockForm.get('returnQty')?.updateValueAndValidity();
  }

  protected onAddToReturnList(): void {
    const { returnQty } = this.returnStockForm.value;
    if (this.selectedProduct) {
      this.cartItems.push({
        loadId: this.selectedProduct['loadId'] as string,
        productId: this.selectedProduct['productId'] as string,
        productName: this.selectedProduct['productName'] as string,
        quantityLoaded: this.selectedProduct['quantityLoaded'] as string,
        quantitySold: this.selectedProduct['quantitySold'] as string,
        balanceQuantity: this.selectedProduct['balanceQuantity'] as string,
        returnedQuantity: returnQty,
      });

      this.selectedProduct = null;
    }
    this.openedIndex = null;
  }

  protected onRemoveFromCart(index: number): void {
    this.cartItems.splice(index, 1);
  }

  protected onSubmit(): void {
    if (this.hasUnreturnedProducts()) {
      alertWarning({
        title: RESPONSE_TITLES.WARNING,
        text: RESPONSE_MESSAGES.RETURN_STOCK_ADD_EDIT_WARNING,
        showCancelButton: false,
        confirmButtonText: 'Okay',
      });
      return;
    }

    const loadId = this.cartItems[0]['loadId'];
    const returnStockList: Record<string, number>[] = this.cartItems.map(
      (item) => {
        return {
          productId: Number(item['productId']),
          quantityReturned: Number(item['returnedQuantity']),
        };
      }
    );

    const payload: IReturnStock = {
      loadId: Number(loadId),
      returnDetailsList: returnStockList,
    };

    this.stockReturnService
      .addReturnStock(payload)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.tableRefresh.emit();
            this.selectedProduct = null;
            this.cartItems = [];
            this.returnStockForm.reset();

            this.onCloseModal();

            alertSuccess({
              title: RESPONSE_TITLES.SUCCESS,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.RETURN_STOCK_ADD_EDIT_SUCCESS,
            });
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.RETURN_STOCK_ADD_EDIT_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private hasUnreturnedProducts(): boolean {
    return this.selectedSaleStockDetailsList.some((item) => {
      const productId = Number(item['productId']);
      const balanceQuantity = Number(item['balanceQuantity']);

      const existsInCart = this.cartItems.some(
        (cart) => Number(cart['productId']) === productId
      );

      return !existsInCart && balanceQuantity !== 0;
    });
  }
}
