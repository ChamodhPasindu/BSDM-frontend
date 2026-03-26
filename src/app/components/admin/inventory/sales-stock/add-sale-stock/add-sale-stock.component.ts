import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as moment from 'moment';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { PaginationType } from 'src/app/enums/PaginationType.enum';
import { UserRole } from 'src/app/enums/UserRole.enum';
import { IEmployeeData } from 'src/app/interfaces/IEmployeeData';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IResponse } from 'src/app/interfaces/IResponse';
import { IRouteData } from 'src/app/interfaces/IRouteData';
import { ISaleStock } from 'src/app/interfaces/ISaleStock';
import { ISaleStockCart } from 'src/app/interfaces/ISaleStockCart';
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
  onValidate,
} from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-add-sale-stock',
  templateUrl: './add-sale-stock.component.html',
  styleUrls: ['./add-sale-stock.component.scss'],
})
export class AddSaleStockComponent extends ModalControlDirective {
  protected readonly ActionButton = ActionButton;
  protected readonly PaginationType = PaginationType;

  protected readonly dropdownSettings = {
    singleSelection: false,
    idField: 'routeId',
    textField: 'routeName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    allowSearchFilter: true,
  };

  protected vehicleList: IVehicleData[];
  protected driverList: IEmployeeData[];
  protected routeList: IRouteData[];
  protected stockList: IStockData[];

  protected currentPage: number = 1;
  protected pageSize: number = 5;
  protected count: number = 0;

  protected inputSearchValue: string;
  protected openedIndex: number | null = null;

  protected selectedStock: IStockData | null = null;
  protected selectedDriver: IEmployeeData | null = null;
  protected selectedVehicle: IVehicleData | null = null;

  protected cartItems: ISaleStockCart[] = [];

  protected saleStockForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly stockService: StockService,
    private readonly saleStockService: SaleStockService,
    private readonly employeeService: EmployeeService,
    private readonly vehicleService: VehicleService,
    private readonly routeService: RouteService
  ) {
    super();
    this.createForm();
  }

  protected override resetState(): void {
    this.selectedStock = null;
    this.selectedDriver = null;
    this.selectedVehicle = null;
    this.cartItems = [];
  }

  public loadData(): void {
    this.loadDriverListData();
    this.loadVehicleListData();
    this.loadRouteListData();
    this.loadStockListData();
  }

  private createForm(): void {
    this.saleStockForm = this.fb.group({
      loadDate: [moment().toDate(), Validators.required],
      vehicleId: [null, Validators.required],
      employeeId: [null, Validators.required],
      routes: [null, Validators.required],
      quantity: ['', Validators.required],
    });
    this.saleStockForm.get('loadDate')?.disable();
    this.setForm(this.saleStockForm);
  }

  private loadDriverListData(): void {
    this.employeeService
      .getEmployeeList({ pageable: false })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.driverList =
              res.body.content.filter(
                (x: IEmployeeData) => x.roleCode === UserRole.SALESMAN
              ) || [];
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.EMPLOYEE_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private loadVehicleListData(): void {
    this.vehicleService
      .getVehicleList({ pageable: false })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.vehicleList = res.body.content || [];
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.VEHICLE_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private loadRouteListData(): void {
    this.routeService
      .getRouteList({ pageable: false })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.routeList = res.body.content.filter((route: IRouteData) => route.statusDescription === 'ACTIVE_ROUTES' ) || [];
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.ROUTE_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  private loadStockListData(): void {
    const paginationRequest: IPagination = {
      pageable: true,
      page: this.currentPage - 1,
      size: this.pageSize,
    };

    this.stockService
      .getStockList(paginationRequest, this.inputSearchValue || '')
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.stockList = res.body.content.content || [];
            this.count = res.body.content.totalElements || 0;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.STOCK_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  protected onSearch(): void {
    this.currentPage = 1;
    this.loadStockListData();
  }

  protected goToPage(page: number): void {
    this.currentPage = page;
    this.loadStockListData();
  }

  protected onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadStockListData();
  }

  protected onDriverChange(event: IEmployeeData): void {
    this.selectedDriver = event;
  }

  protected onVehicleChange(event: IVehicleData): void {
    this.selectedVehicle = event;
  }

  protected onSelectProduct(stock: IStockData, index: number): void {
    this.openedIndex = index;
    this.selectedStock = stock;

    this.saleStockForm.get('quantity')?.setValue('');
    const maxQty = stock.remainingQuantity ?? 0;

    this.saleStockForm
      .get('quantity')
      ?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(maxQty),
      ]);

    this.saleStockForm.get('quantity')?.updateValueAndValidity();
  }

  protected onAddToAssignList(): void {
    const { quantity } = this.saleStockForm.value;
    if (this.selectedStock) {
      this.cartItems.push({
        stock: this.selectedStock,
        quantity: quantity,
      });
      this.selectedStock = null;
    }
    this.openedIndex = null;
  }

  protected onRemoveFromCart(index: number): void {
    this.cartItems.splice(index, 1);
  }

  protected onSubmit(): void {
    if (!onValidate(this.saleStockForm)) return;

    const { routes } = this.saleStockForm.value;

    const stockList: Record<string, number>[] = this.cartItems.map((item) => {
      return {
        productId: item.stock.productId,
        quantityLoaded: item.quantity,
      };
    });

    const routeList: number[] = routes.map(
      (route: Record<string, number>) => route['routeId']
    );

    const payload: ISaleStock = {
      vehicleId: this.selectedVehicle!.vehicleId,
      employeeId: this.selectedDriver!.userId,
      routeId: routeList,
      loadDate: moment().format('YYYY-MM-DD'),
      stockList: stockList,
    };

    this.saleStockService
      .addSaleStock(payload)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.tableRefresh.emit();
            this.onCloseModal();
            alertSuccess({
              title: RESPONSE_TITLES.SUCCESS,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.SALE_STOCK_ADD_EDIT_SUCCESS,
            });
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message ||
                RESPONSE_MESSAGES.SALE_STOCK_ADD_EDIT_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }
}
