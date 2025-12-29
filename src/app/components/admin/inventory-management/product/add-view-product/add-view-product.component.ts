import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { IBatchData } from 'src/app/interfaces/IBatchData';
import { IItemData } from 'src/app/interfaces/IItemData';
import { IProduct } from 'src/app/interfaces/IProduct';
import { IProductData } from 'src/app/interfaces/IProductData';
import { IResponse } from 'src/app/interfaces/IResponse';
import { BatchService } from 'src/app/services/batch/batch.service';
import { ItemService } from 'src/app/services/item/item.service';
import { ProductService } from 'src/app/services/product/product.service';
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
  onValidate,
} from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-add-view-product',
  templateUrl: './add-view-product.component.html',
  styleUrls: ['./add-view-product.component.scss'],
})
export class AddViewProductComponent extends ModalControlDirective
{
protected readonly ActionButton = ActionButton;

private _product: IProductData | undefined;
private _action: ActionButton;

protected productForm: FormGroup;

protected itemList: IItemData[];
protected batchList: IBatchData[];

protected selectedItem: IItemData | null;
protected selectedBatch: IBatchData | null;

@Input()
public set product(value: IProductData | undefined) {
  this._product = value;
  this.updateForm();
}

public get product() {
  return this._product;
}

@Input()
public set action(value: ActionButton) {
  this._action = value;
  this.updateForm();
}

public get action() {
  return this._action;
}

constructor(
  private readonly fb: FormBuilder,
  private readonly productService: ProductService,
  private readonly itemService: ItemService,
  private readonly batchService: BatchService
) {
  super();
  this.createForm();
}

protected override resetState(): void {}

public loadData(): void {
  this.loadItemListData();
  this.loadBatchListData();
}

private createForm(): void {
  this.productForm = this.fb.group({
    batchId: [null, Validators.required],
    productNameId: [null, Validators.required],
    quantity: ['', Validators.required],
    description: ['', Validators.required],
    price: ['', Validators.required],
    minSalesPrice: ['', Validators.required],
  });
  this.setForm(this.productForm);
}

private loadBatchListData(): void {
  this.batchService
    .getBatchList({ pageable: false })
    .pipe(untilDestroyed(this))
    .subscribe({
      next: (res: IResponse) => {
        if (res.body.status === RSP_SUCCESS) {
          this.batchList = res.body.content || [];
        } else {
          alertError({
            title: RESPONSE_TITLES.FAILED,
            text: res.body.message || RESPONSE_MESSAGES.BATCH_GET_FAILED,
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        errorMessageHandler(err);
      },
    });
}

private loadItemListData(): void {
  this.itemService
    .getItemList({ pageable: false })
    .pipe(untilDestroyed(this))
    .subscribe({
      next: (res: IResponse) => {
        if (res.body.status === RSP_SUCCESS) {
          this.itemList = res.body.content || [];
        } else {
          alertError({
            title: RESPONSE_TITLES.FAILED,
            text: res.body.message || RESPONSE_MESSAGES.ITEM_GET_FAILED,
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        errorMessageHandler(err);
      },
    });
}

private updateForm(): void {
  if (!this.action) return;

  this.selectedItem = null;
  this.selectedBatch = null;

  if (this.action === ActionButton.VIEW) {
    this.patchValue();
    this.productForm.disable();
  }

  if (this.action === ActionButton.EDIT) {
    this.patchValue();
    this.productForm.enable();
  }

  if (this.action === ActionButton.ADD) {
    this.productForm.enable();
  }
}

private patchValue(): void {
  this.productForm.patchValue({
    batchId: this.product?.batchId,
    productNameId: this.product?.nameId,
    quantity: this.product?.quantity,
    description: this.product?.description,
    price: this.product?.price,
    minSalesPrice: this.product?.minSalesPrice,
  });

  this.selectedItem =
    this.itemList.find((x: IItemData) => x.nameId === this.product?.nameId) ||
    null;

  this.selectedBatch =
    this.batchList.find(
      (x: IBatchData) => x.batchId === this.product?.batchId
    ) || null;
}

protected onSubmit(): void {
  if (!onValidate(this.productForm)) return;

  if (this.action === ActionButton.ADD) {
    this.addProduct(this.productForm.value);
  } else {
    this.updateProduct({
      ...this.productForm.value,
      productId: this.product?.productId,
    });
  }
}

private addProduct(data: IProduct): void {
  this.productService
    .addProduct(data)
    .pipe(untilDestroyed(this))
    .subscribe({
      next: (res: IResponse) => {
        if (res.body.status === RSP_SUCCESS) {
          this.tableRefresh.emit();
          this.onCloseModal();
          alertSuccess({
            title: RESPONSE_TITLES.SUCCESS,
            text:
              res.body.message || RESPONSE_MESSAGES.PRODUCT_ADD_EDIT_SUCCESS,
          });
        } else {
          alertError({
            title: RESPONSE_TITLES.FAILED,
            text: res.body.message || RESPONSE_MESSAGES.PRODUCT_DELETE_FAILED,
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        errorMessageHandler(err);
      },
    });
}

private updateProduct(data: IProduct): void {
  this.productService
    .updateProduct(data)
    .pipe(untilDestroyed(this))
    .subscribe({
      next: (res: IResponse) => {
        if (res.body.status === RSP_SUCCESS) {
          this.tableRefresh.emit();
          this.onCloseModal();
          alertSuccess({
            title: RESPONSE_TITLES.SUCCESS,
            text:
              res.body.message || RESPONSE_MESSAGES.PRODUCT_ADD_EDIT_SUCCESS,
          });
        } else {
          alertError({
            title: RESPONSE_TITLES.FAILED,
            text:
              res.body.message || RESPONSE_MESSAGES.PRODUCT_ADD_EDIT_FAILED,
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        errorMessageHandler(err);
      },
    });
}
}
