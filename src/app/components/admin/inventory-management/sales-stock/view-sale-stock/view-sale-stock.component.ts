import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { PaginationType } from 'src/app/enums/PaginationType.enum';
import { IEmployeeData } from 'src/app/interfaces/IEmployeeData';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IProductData } from 'src/app/interfaces/IProductData';
import { IResponse } from 'src/app/interfaces/IResponse';
import { IRouteData } from 'src/app/interfaces/IRouteData';
import { ISaleStockCart } from 'src/app/interfaces/ISaleStockCart';
import { IVehicleData } from 'src/app/interfaces/IVehicleData';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { ProductService } from 'src/app/services/product/product.service';
import { RouteService } from 'src/app/services/route/route.service';
import { VehicleService } from 'src/app/services/vehicle/vehicle.service';
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
  implements OnInit
{
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

  private _saleStock: any | undefined;
  private _action: ActionButton;

  protected vehicleList: IVehicleData[];
  protected driverList: IEmployeeData[];
  protected routeList: IRouteData[];
  protected productList: IProductData[];

  protected currentPage: number = 1;
  protected pageSize: number = 5;
  protected count: number = 0;

  protected inputSearchValue: string;
  protected openedIndex: number | null = null;

  protected selectedProduct: IProductData | null = null;
  protected selectedDriver: IEmployeeData | null = null;
  protected selectedVehicle: IVehicleData | null = null;

  protected cartItems: ISaleStockCart[] = [];

  protected saleStockForm: FormGroup;

  @Input()
  public set saleStock(value: any | undefined) {
    this._saleStock = value;
    this.updateForm();
  }

  public get saleStock() {
    return this._saleStock;
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
    private readonly productService: ProductService,
    private readonly employeeService: EmployeeService,
    private readonly vehicleService: VehicleService,
    private readonly routeService: RouteService
  ) {
    super();
    this.createForm();
  }

  ngOnInit() {
    this.loadDriverListData();
    this.loadVehicleListData();
    this.loadRouteListData();
    this.loadProductListData();
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

  private updateForm(): void {
    if (!this.action) return;

    // if (this.action === ActionButton.VIEW) {
    //   this.patchValue();
    //   this.productForm.disable();
    // }

    // if (this.action === ActionButton.EDIT) {
    //   this.patchValue();
    //   this.productForm.enable();
    // }

    // if (this.action === ActionButton.ADD) {
    //   this.productForm.enable();
    // }
  }


  private loadDriverListData(): void {
    this.employeeService
      .getEmployeeList({ pageable: false })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.driverList = res.body.content || [];
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
            this.routeList = res.body.content || [];
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

  private loadProductListData(): void {
    const paginationRequest: IPagination = {
      pageable: true,
      page: this.currentPage - 1,
      size: this.pageSize,
    };

    this.productService
      .getProductList(paginationRequest, this.inputSearchValue || '')
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.productList = res.body.content.content || [];
            this.count = res.body.content.totalElements || 0;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.PRODUCT_GET_FAILED,
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
    this.loadProductListData();
  }

  protected goToPage(page: number): void {
    this.currentPage = page;
    this.loadProductListData();
  }

  protected onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadProductListData();
  }
 
  protected onDriverChange(event: IEmployeeData): void {
    this.selectedDriver = event;
  }

  protected onVehicleChange(event: IVehicleData): void {
    this.selectedVehicle = event;
  }

  protected onSelectProduct(product: IProductData, index: number): void {
    this.openedIndex = index;
    this.selectedProduct = product;
  }

  protected onAddToAssignList(): void {
    console.log(this.saleStockForm.value);

    const { quantity, routes } = this.saleStockForm.value;
    if (this.selectedProduct) {
      this.cartItems.push({
        product: this.selectedProduct,
        vehicle: this.selectedVehicle!,
        driver: this.selectedDriver!,
        routes: routes,
        quantity: quantity,
      });
      this.selectedProduct = null;
    }
    this.openedIndex = null;
  }

  protected onRemoveFromCart(index: number):void {
    this.cartItems.splice(index, 1);
  }

  protected onSubmit():void {
    alert('Stock assignment confirmed!');
  }
}
