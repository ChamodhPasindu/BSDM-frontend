import { Component, OnInit, ViewChild } from '@angular/core';
import { ViewProductComponent } from './view-product/view-product.component';
import {
  alertError,
  alertSuccess,
  alertWarning,
  datePickerToDate,
  errorMessageHandler,
} from 'src/app/utility/helper';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from 'src/app/services/product/product.service';
import { IPagination } from 'src/app/interfaces/IPagination';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from 'src/app/interfaces/IResponse';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { HttpErrorResponse } from '@angular/common/http';
import { SweetAlertResult } from 'sweetalert2';
import { IProductData } from 'src/app/interfaces/IProductData';

@UntilDestroy()
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  @ViewChild('productModal') protected productModal!: ViewProductComponent;

  protected readonly ActionButton = ActionButton;
  protected productList: IProductData[];

  protected currentPage: number = 1;
  protected pageSize: number = 5;
  protected count: number = 0;

  protected searchForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly productService: ProductService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadProductTableData();
  }

  private createForm(): void {
    this.searchForm = this.fb.group({
      inputValue: [''],
      fromDate: [''],
      toDate: [''],
    });
  }

  protected onSubmit(): void {
    this.loadProductTableData();
  }

  protected onRefresh(): void {
    this.loadProductTableData();
  }

  private loadProductTableData(): void {
    const { inputValue, fromDate, toDate } = this.searchForm.value;

    let formattedFromDate = null;
    let formattedToDate = null;
    if (fromDate) {
      formattedFromDate = datePickerToDate(fromDate);
    }

    if (toDate) {
      formattedToDate = datePickerToDate(toDate);
    }

    const paginationRequest: IPagination = {
      pageable: true,
      page: this.currentPage - 1,
      size: this.pageSize,
    };

    this.productService
      .getProductList(
        paginationRequest,
        inputValue || '',
        formattedFromDate,
        formattedToDate
      )
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

  protected goToPage(page: number): void {
    this.currentPage = page;
    this.loadProductTableData();
  }

  protected onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadProductTableData();
  }

  protected openProductView(action: ActionButton, product?: IProductData): void {
    this.productModal.loadData();
    this.productModal.action = action;
    this.productModal.product = product;
    this.productModal.visible = true;
  }

  protected onClear(): void {
    this.searchForm.reset();
    this.loadProductTableData();
  }

  protected hasAnyValue(): boolean {
    const { inputValue, fromDate, toDate } = this.searchForm.value;

    return !!(inputValue || fromDate || toDate);
  }

  protected onDeleteProduct(id: number): void {
    alertWarning(
      {
        title: RESPONSE_TITLES.WARNING,
        text: RESPONSE_MESSAGES.DELETE_CONFIRMATION,
      },
      (result: SweetAlertResult<any>) => {
        if (result.isConfirmed) {
          this.productService
            .deleteProduct(id)
            .pipe(untilDestroyed(this))
            .subscribe({
              next: (res: IResponse) => {
                if (res.body.status === RSP_SUCCESS) {
                  this.loadProductTableData();
                  alertSuccess({
                    title: RESPONSE_TITLES.DONE,
                    text:
                      res.body.message ||
                      RESPONSE_MESSAGES.PRODUCT_DELETE_SUCCESS,
                  });
                } else {
                  alertError({
                    title: RESPONSE_TITLES.FAILED,
                    text:
                      res.body.message || RESPONSE_MESSAGES.PRODUCT_DELETE_FAILED,
                  });
                }
              },
              error: (err: HttpErrorResponse) => {
                errorMessageHandler(err);
              },
            });
        }
      }
    );
  }
}
