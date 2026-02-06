import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from 'src/app/interfaces/IResponse';
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
  errorMessageHandler,
} from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-review-return-stock',
  templateUrl: './review-return-stock.component.html',
  styleUrls: ['./review-return-stock.component.scss'],
})
export class ReviewReturnStockComponent
  extends ModalControlDirective
{
  protected saleStockList: Record<string, string | number>[] = [];
  protected selectedSaleStockDetailsList: Record<string, string | number>[] =
    [];
  protected loadId: string;

  constructor(private readonly stockReturnService: StockReturnService) {
    super();
  }

  protected override resetState(): void {}

  public loadData(): void {
    this.loadReturnStockList();
  }

  private loadReturnStockList(): void {
    this.stockReturnService
      .getReApprovedReturnDropDownList()
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

  protected onReturnStockChange(event: Record<string, string>) {
    if (!event) {
      this.selectedSaleStockDetailsList = [];
      return;
    }

    this.stockReturnService
      .getSaleStockDetailsById(event['code'])
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.loadId = event['code'] as string;
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

  protected onSubmit() {
    this.stockReturnService
      .reconfirmReturn(Number(this.loadId))
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.tableRefresh.emit();
            this.saleStockList = [];
            this.selectedSaleStockDetailsList = [];
            this.onCloseModal();
            alertSuccess({
              title: RESPONSE_TITLES.SUCCESS,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.RETURN_STOCK_RECONFIRM_SUCCESS,
            });
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.RETURN_STOCK_RECONFIRM_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => errorMessageHandler(err),
      });
  }
}
