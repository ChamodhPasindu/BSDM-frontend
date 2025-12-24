import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { ModalControlDirective } from 'src/app/utility/directives/modal-control.directive';

@UntilDestroy()
@Component({
  selector: 'app-view-return-stock',
  templateUrl: './view-return-stock.component.html',
  styleUrls: ['./view-return-stock.component.scss'],
})
export class ViewReturnStockComponent
  extends ModalControlDirective
  implements OnInit
{
  private _returnStock: any | undefined;
  private _action: ActionButton;

  @Input()
  public set returnStock(value: any | undefined) {
    this._returnStock = value;
    this.updateForm();
  }

  public get returnStock() {
    return this._returnStock;
  }

  @Input()
  public set action(value: ActionButton) {
    this._action = value;
  }

  public get action() {
    return this._action;
  }

  ngOnInit(): void {}

  private updateForm(): void {}

  public loadData(): void {}
}
