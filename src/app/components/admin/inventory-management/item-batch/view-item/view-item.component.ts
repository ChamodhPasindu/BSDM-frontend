import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { IItemData } from 'src/app/interfaces/IItemData';
import { IResponse } from 'src/app/interfaces/IResponse';
import { ItemService } from 'src/app/services/item/item.service';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { REGEX_NAME } from 'src/app/utility/constants/validation';
import { ModalControlDirective } from 'src/app/utility/directives/modal-control.directive';
import {
  alertError,
  alertSuccess,
  errorMessageHandler,
  onValidate,
} from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.scss'],
})
export class ViewItemComponent extends ModalControlDirective {
  protected readonly ActionButton = ActionButton;

  private _item: IItemData | undefined;
  private _action: ActionButton;

  protected itemForm: FormGroup;

  @Input()
  public set item(value: IItemData | undefined) {
    this._item = value;
    this.updateForm();
  }

  public get item() {
    return this._item;
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
    private readonly itemService: ItemService
  ) {
    super();
    this.createForm();
  }

  protected createForm(): void {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(REGEX_NAME)]],
      description: ['', [Validators.required]],
      alertQuantity: ['', [Validators.required]],
    });
    this.setForm(this.itemForm);
  }

  private updateForm(): void {
    if (!this.action) return;

    if (this.action === ActionButton.VIEW) {
      this.patchValue();
      this.itemForm.disable();
    }

    if (this.action === ActionButton.EDIT) {
      this.patchValue();
      this.itemForm.enable();
    }

    if (this.action === ActionButton.ADD) {
      this.itemForm.enable();
    }
  }

  private patchValue(): void {
    this.itemForm.patchValue({
      name: this.item?.name,
      description: this.item?.description,
      alertQuantity: this.item?.alertQuantity,
    });
  }

  protected onSubmit(): void {
    if (!onValidate(this.itemForm)) return;

    if (this.action === ActionButton.ADD) {
      this.addItem();
    } else {
      this.updateItem(this.item?.nameId);
    }
  }

  private addItem(): void {
    this.itemService
      .addItem(this.itemForm.value)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.tableRefresh.emit();
            this.onCloseModal();
            alertSuccess({
              title: RESPONSE_TITLES.SUCCESS,
              text: res.body.message || RESPONSE_MESSAGES.ITEM_ADD_EDIT_SUCCESS,
            });
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.ITEM_DELETE_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private updateItem(itemId: number | undefined): void {
    this.itemService
      .updateItem({ ...this.itemForm.value, nameId: itemId })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.tableRefresh.emit();
            this.onCloseModal();
            alertSuccess({
              title: RESPONSE_TITLES.SUCCESS,
              text: res.body.message || RESPONSE_MESSAGES.ITEM_ADD_EDIT_SUCCESS,
            });
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.ITEM_ADD_EDIT_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }
}
