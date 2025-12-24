import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { IProductData } from 'src/app/interfaces/IProductData';
import { IResponse } from 'src/app/interfaces/IResponse';
import { IStockData } from 'src/app/interfaces/IStockData';
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
  selector: 'app-edit-view-stock',
  templateUrl: './edit-view-stock.component.html',
  styleUrls: ['./edit-view-stock.component.scss'],
})
export class EditViewStockComponent
  extends ModalControlDirective
  implements OnInit
{
  protected readonly ActionButton = ActionButton;

  private _stock: IStockData | undefined;
  private _action: ActionButton;

  protected product: IProductData | null;

  protected productDetailForm: FormGroup;

  @Input()
  public set stock(value: IStockData | undefined) {
    this._stock = value;
    this.updateForm();
  }

  public get stock() {
    return this._stock;
  }

  @Input()
  public set action(value: ActionButton) {
    this._action = value;
  }

  public get action() {
    return this._action;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly stockService: StockService
  ) {
    super();
    this.createForm();
  }

  ngOnInit(): void {}

  private createForm(): void {
    this.productDetailForm = this.fb.group({
      quantity: [''],
      reason: ['', [Validators.required]],
    });
    this.setForm(this.productDetailForm);
  }

  private updateForm(): void {
    if (!this.action) return;

    this.loadProductData(this.stock?.stockId!);
  }

  private loadProductData(id: number): void {
    this.stockService
      .getStockById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.product = res.body.content;

            this.patchValue();
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

  private patchValue(): void {
    if (this.action === ActionButton.VIEW) {
      this.productDetailForm.patchValue({
        quantity: this.product?.currentQuantity,
        reason: this.stock?.reason,
      });
      this.productDetailForm.disable();
    }

    if (this.action === ActionButton.EDIT) {
      this.productDetailForm.enable();

      this.productDetailForm
        .get('quantity')
        ?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(this.product?.minQuantity!),
        ]);

      this.productDetailForm.get('quantity')?.updateValueAndValidity();
      this.productDetailForm.get('reason')?.setValue(this.stock?.reason);
    }
  }

  protected onSubmit(): void {
    const { quantity, reason } = this.productDetailForm.value;

    this.stockService
      .updateStock(this.product?.productId!, quantity, reason)
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
