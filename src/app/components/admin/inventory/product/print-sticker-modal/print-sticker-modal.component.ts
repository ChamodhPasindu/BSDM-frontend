import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalControlDirective } from 'src/app/utility/directives/modal-control.directive';
import { PrintStickerService } from 'src/app/services/general/print-sticker.service';
import { IProductData } from 'src/app/interfaces/IProductData';
import { alertError, alertSuccess } from 'src/app/utility/helper';
import {
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';

@Component({
  selector: 'app-print-sticker-modal',
  templateUrl: './print-sticker-modal.component.html',
  styleUrls: ['./print-sticker-modal.component.scss'],
})
export class PrintStickerModalComponent extends ModalControlDirective {
  private _product: IProductData | undefined;
  protected stickerForm: FormGroup;

  @Input()
  public set product(value: IProductData | undefined) {
    this._product = value;
  }

  public get product() {
    return this._product;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly printStickerService: PrintStickerService,
  ) {
    super();
    this.createForm();
  }

  private createForm(): void {
    this.stickerForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  public onPrint(): void {
    try {
      const quantity = this.stickerForm.get('quantity')?.value || 1;
      this.printStickerService.printStickers(this.product!, quantity);

      setTimeout(() => {
        this.onCloseModal();
        alertSuccess({
          title: RESPONSE_TITLES.DONE,
          text: `${quantity} sticker(s) sent to print`,
        });
      }, 500);
    } catch (error) {
      alertError({
        title: RESPONSE_TITLES.FAILED,
        text: 'Failed to print stickers. Please try again.',
      });
    } 
  }

  public override onChangeModalVisibility(event: boolean): void {
    this.visible = event;
    if (!event) {
      this.resetState();
    }
  }

  protected resetState(): void {
    this.stickerForm.reset({ quantity: 1 });
    this.product = undefined;
  }
}
