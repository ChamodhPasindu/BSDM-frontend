import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as moment from 'moment';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { CommonCode } from 'src/app/enums/CommonCode.enum';
import { PaginationType } from 'src/app/enums/PaginationType.enum';
import { UserRole } from 'src/app/enums/UserRole.enum';
import { IEmployeeData } from 'src/app/interfaces/IEmployeeData';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IProductData } from 'src/app/interfaces/IProductData';
import { IResponse } from 'src/app/interfaces/IResponse';
import { IRouteData } from 'src/app/interfaces/IRouteData';
import { ISaleStock } from 'src/app/interfaces/ISaleStock';
import { ISaleStockCart } from 'src/app/interfaces/ISaleStockCart';
import { ISaleStockData } from 'src/app/interfaces/ISaleStockData';
import { IStockData } from 'src/app/interfaces/IStockData';
import { IVehicleData } from 'src/app/interfaces/IVehicleData';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { GeneralService } from 'src/app/services/general/general.service';
import { RouteService } from 'src/app/services/route/route.service';
import { SaleStockService } from 'src/app/services/sale-stock/sale-stock.service';
import { StockService } from 'src/app/services/stock/stock.service';
import { VehicleService } from 'src/app/services/vehicle/vehicle.service';
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
  selector: 'app-view-sale-stock',
  templateUrl: './view-sale-stock.component.html',
  styleUrls: ['./view-sale-stock.component.scss'],
})
export class ViewSaleStockComponent
  extends ModalControlDirective
  implements OnInit
{
  protected readonly ActionButton = ActionButton;

  private _saleStock: ISaleStockData | undefined;
  private _action: ActionButton;

  protected saleStockDetails: Record<string, string> | null = null;
  protected routeList: Record<string, string>[] =[];
  protected productList: Record<string, string>[]=[];

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

  ngOnInit() {}

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
