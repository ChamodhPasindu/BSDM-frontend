import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { IResponse } from 'src/app/interfaces/IResponse';
import { IReturnStockData } from 'src/app/interfaces/IReturnStockData';
import { StockReturnService } from 'src/app/services/stock-return/stock-return.service';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { ModalControlDirective } from 'src/app/utility/directives/modal-control.directive';
import { alertError, errorMessageHandler } from 'src/app/utility/helper';

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
  private _returnStock: IReturnStockData | undefined;
  private _action: ActionButton;

  protected selectedSaleStockDetailsList: Record<string, string | number>[] =
    [];

  @Input()
  public set returnStock(value: IReturnStockData | undefined) {
    this._returnStock = value;
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

  constructor(private readonly stockReturnService: StockReturnService) {
    super();
  }

  ngOnInit(): void {}

  public loadData(): void {
    this.loadReturnStockDetails();
  }

  private loadReturnStockDetails(): void {
    this.stockReturnService
      .getReturnStockDetailsById(this.returnStock?.loadId!)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.selectedSaleStockDetailsList = res.body.content.items;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message || RESPONSE_MESSAGES.RETURN_STOCK_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }
}
