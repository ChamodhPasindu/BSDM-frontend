import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { IResponse } from 'src/app/interfaces/IResponse';
import { ISaleStockData } from 'src/app/interfaces/ISaleStockData';
import { SaleStockService } from 'src/app/services/sale-stock/sale-stock.service';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { ModalControlDirective } from 'src/app/utility/directives/modal-control.directive';
import { alertError, errorMessageHandler } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-view-sale-stock',
  templateUrl: './view-sale-stock.component.html',
  styleUrls: ['./view-sale-stock.component.scss'],
})
export class ViewSaleStockComponent
  extends ModalControlDirective
{
  protected readonly ActionButton = ActionButton;

  private _saleStock: ISaleStockData | undefined;
  private _action: ActionButton;

  protected saleStockDetails: Record<string, string> | null = null;
  protected routeList: Record<string, string>[] = [];
  protected productList: Record<string, string>[] = [];

  @Input()
  public set saleStock(value: ISaleStockData | undefined) {
    this._saleStock = value;
  }

  public get saleStock() {
    return this._saleStock;
  }

  @Input()
  public set action(value: ActionButton) {
    this._action = value;
  }

  public get action() {
    return this._action;
  }

  constructor(private readonly saleStockService: SaleStockService) {
    super();
  }

  protected override resetState(): void {}

  public loadData(): void {
    this.loadSaleStockDetails();
  }

  private loadSaleStockDetails(): void {
    this.saleStockService
      .getSaleStockDetailsById(this.saleStock?.loadId!)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.saleStockDetails = res.body.content.headerResponse;
            this.routeList = res.body.content.headerResponse.route;
            this.productList = res.body.content.items;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.SALE_STOCK_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }
}
