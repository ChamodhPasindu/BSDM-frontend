import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BillStatus } from 'src/app/enums/BillStatus.enum';
import { IOrderItemData } from 'src/app/interfaces/IOrderItemData';
import { IResponse } from 'src/app/interfaces/IResponse';
import { ISaleData } from 'src/app/interfaces/ISaleData';
import { SaleService } from 'src/app/services/sale/sale.service';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { ModalControlDirective } from 'src/app/utility/directives/modal-control.directive';
import { alertError, errorMessageHandler } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-view-sale',
  templateUrl: './view-sale.component.html',
  styleUrls: ['./view-sale.component.scss'],
})
export class ViewSaleComponent extends ModalControlDirective {
  protected readonly BillStatus = BillStatus;

  protected saleOrderDetailList: IOrderItemData[] = [];

  private _sale: ISaleData | undefined;

  @Input()
  public set sale(value: ISaleData | undefined) {
    this._sale = value;
  }

  public get sale() {
    return this._sale;
  }

  protected override resetState(): void {
    this.saleOrderDetailList = [];
  }

  constructor(private readonly saleService: SaleService) {
    super();
  }

  public loadData(): void {
    this.getSaleData();
  }

  private getSaleData(): void {
    this.saleService
      .getSaleById(this.sale?.orderId!)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.saleOrderDetailList = res.body.content.orderDetails;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.SALE_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => errorMessageHandler(err),
      });
  }
}
