import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IItemOrderData, IOrder } from 'src/app/interfaces/IItemOrderData';
import { IResponse } from 'src/app/interfaces/IResponse';
import { ISaleItemData } from 'src/app/interfaces/ISaleItemData';
import { SaleService } from 'src/app/services/sale/sale.service';
import { PaginationType } from 'src/app/enums/PaginationType.enum';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { ModalControlDirective } from 'src/app/utility/directives/modal-control.directive';
import { alertError, errorMessageHandler } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-view-sale-item',
  templateUrl: './view-sale-item.component.html',
  styleUrls: ['./view-sale-item.component.scss'],
})
export class ViewSaleItemComponent extends ModalControlDirective {
  protected readonly PaginationType = PaginationType;

  protected saleItemDetail: IItemOrderData | null = null;
  protected orderDetailList: IOrder[] = [];
  protected pagedOrderDetailList: IOrder[] = [];
  
  protected totalOrders = 0;
  protected currentPage = 1;
  protected pageSize = 10;

  private _saleItem: ISaleItemData | undefined;

  @Input()
  public set saleItem(value: ISaleItemData | undefined) {
    this._saleItem = value;
  }

  public get saleItem() {
    return this._saleItem;
  }

  constructor(private readonly saleService: SaleService) {
    super();
  }

  protected override resetState(): void {
    this.saleItemDetail = null;
    this.orderDetailList = [];
    this.pagedOrderDetailList = [];
    this.totalOrders = 0;
    this.currentPage = 1;
    this.pageSize = 10;
  }

  public loadData(): void {
    this.getSaleItemData();
  }

  private getSaleItemData(): void {
    this.saleService
      .getSaleItemById(this.saleItem?.itemId!)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.saleItemDetail = res.body.content;
            this.orderDetailList = this.saleItemDetail?.details || [];
            this.totalOrders = this.orderDetailList.length;
            this.currentPage = 1;
            this.updatePagedOrders();
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.SALE_ITEM_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => errorMessageHandler(err),
      });
  }

  protected goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagedOrders();
  }

  protected onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.updatePagedOrders();
  }

  private updatePagedOrders(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedOrderDetailList = this.orderDetailList.slice(start, end);
  }
}
