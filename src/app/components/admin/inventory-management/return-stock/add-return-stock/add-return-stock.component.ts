import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CommonCode } from 'src/app/enums/CommonCode.enum';
import { IResponse } from 'src/app/interfaces/IResponse';
import { GeneralService } from 'src/app/services/general/general.service';
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
  selector: 'app-add-return-stock',
  templateUrl: './add-return-stock.component.html',
  styleUrls: ['./add-return-stock.component.scss'],
})
export class AddReturnStockComponent
  extends ModalControlDirective
  implements OnInit
{
  protected saleStockList: Record<string, string | number>[];
  protected statusList: Record<string, string | number>[];

  protected selectedSaleStock: any = null;

  protected returnStockForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly generalService: GeneralService,
    private readonly stockReturnService: StockReturnService
  ) {
    super();
    this.createForm();
  }

  ngOnInit(): void {}

  private createForm(): void {
    this.returnStockForm = this.fb.group({
      saleStock: [null, Validators.required],
      status: [null, Validators.required],
    });
    this.setForm(this.returnStockForm);
  }

  public loadData(): void {
    this.loadStatusList();
    this.loadSaleStockList();
  }

  private loadSaleStockList(): void {}

  private loadStatusList(): void {
    this.generalService
      .getStatusList(CommonCode.RETURN)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.statusList = res.body.content.dropdown;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.COMMON_ERROR_DES,
            });
          }
        },
        error: (err: HttpErrorResponse) => errorMessageHandler(err),
      });
  }

  protected onSaleStockChange(event: any): void {
    this.selectedSaleStock = event;
  }

  assignedStocks = [
    {
      id: 1,
      date: '2025-11-01',
      driver: { id: 1, name: 'John Doe' },
      vehicle: { id: 1, number: 'KA-4567' },
      route: { id: 1, name: 'Colombo North' },
      products: [
        { id: 1, name: 'Cement Bag', category: 'Building', assignedQty: 50 },
        { id: 2, name: 'Steel Rod', category: 'Hardware', assignedQty: 30 },
      ],
    },
    {
      id: 2,
      date: '2025-11-02',
      driver: { id: 2, name: 'Mark Silva' },
      vehicle: { id: 2, number: 'BA-2345' },
      route: { id: 2, name: 'Galle Route' },
      products: [
        { id: 3, name: 'Bricks', category: 'Building', assignedQty: 100 },
      ],
    },
  ];

  selectedAssign: any = null;
  selectedProduct: any = null;
  returnQuantity: number | null = null;

  returnList: any[] = [];

  // // Modal controls
  // changeModalVisibility(event: boolean) {
  //   this.visible = event;
  // }

  // closeModal() {
  //   this.visible = false;
  // }

  onAssignChange() {
    this.selectedProduct = null;
    this.returnQuantity = null;
    this.returnList = [];
  }

  selectProduct(product: any) {
    this.selectedProduct = product;
    this.returnQuantity = null;
  }

  addReturn() {
    const existing = this.returnList.find(
      (r) => r.id === this.selectedProduct.id
    );
    if (existing) {
      existing.returnQty = this.returnQuantity;
    } else {
      this.returnList.push({
        ...this.selectedProduct,
        returnQty: this.returnQuantity,
      });
    }
    this.selectedProduct = null;
    this.returnQuantity = null;
  }

  removeReturn(index: number) {
    this.returnList.splice(index, 1);
  }

  confirmReturn() {
    alert('Return stock successfully recorded!');
  }
}
