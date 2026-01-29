import { Component, OnInit, ViewChild } from '@angular/core';
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
import { AddViewProductComponent } from './add-view-product/add-view-product.component';
import * as moment from 'moment';
import { PdfExportService } from 'src/app/services/general/pdf-export.service';

@UntilDestroy()
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  @ViewChild('addViewProductModal')
  private readonly addViewProductModal!: AddViewProductComponent;

  protected readonly ActionButton = ActionButton;
  protected productList: IProductData[];

  protected currentPage: number = 1;
  protected pageSize: number = 5;
  protected count: number = 0;

  protected searchForm: FormGroup;

  private today = new Date();

  constructor(
    private readonly fb: FormBuilder,
    private readonly productService: ProductService,
    private readonly pdfExportService: PdfExportService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadProductTableData();
  }

  private createForm(): void {
    this.searchForm = this.fb.group({
      inputValue: [''],
      fromDate: [this.today],
      toDate: [this.today],
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
        formattedToDate,
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

  protected openProductView(
    action: ActionButton,
    product?: IProductData,
  ): void {
    this.addViewProductModal.action = action;
    this.addViewProductModal.product = product;
    this.addViewProductModal.visible = true;
  }

  protected onExport(): void {
    if (!this.productList || this.productList.length === 0) {
      alertError({
        title: RESPONSE_TITLES.FAILED,
        text: RESPONSE_MESSAGES.PRODUCT_EXPORT_FAILED,
      });
      return;
    }

    const columns = [
      { header: 'Batch Code', width: 0.13 },
      { header: 'Product Name', width: 0.1 },
      { header: 'Min Price(LKR)', width: 0.1 },
      { header: 'Price(LKR)', width: 0.1 },
      { header: 'Total(Qty)', width: 0.1 },
      { header: 'Assign Stock(Qty)', width: 0.1 },
      { header: 'Balance(Qty)', width: 0.12 },
      { header: 'Date(Manufacture & Expire)', width: 0.15 },
      { header: 'Usable Days', width: 0.1 },
    ];

    const data = this.productList.map((product) => [
      product.batchCode || '',
      product.productName || '',
      product.minSalesPrice || '',
      product.price || '',
      product.quantityP || '',
      product.assignedStockQuantityP || '',
      product.balanceQuantityP || '',
      `${moment(product.manufactureDate).format('YYYY-MM-DD')} - ${moment(product.expiryDate).format('YYYY-MM-DD')}`,
      product.usableDays || '',
    ]);

    this.pdfExportService.exportToPdf({
      title: 'Product Report',
      columns: columns,
      data: data,
      filename: `Product_Report_${moment().format('YYYY-MM-DD_HH-mm-ss')}.pdf`,
      companyName: 'Visco Bakehouse Sales Delivery Monitoring System',
      mobileNumber: '+94 (0) 123 456 789',
      orientation: 'landscape',
    });
  }

  protected onClear(): void {
    this.searchForm.reset({
      fromDate: this.today,
      toDate: this.today,
    });
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
                      res.body.message ||
                      RESPONSE_MESSAGES.PRODUCT_DELETE_FAILED,
                  });
                }
              },
              error: (err: HttpErrorResponse) => {
                errorMessageHandler(err);
              },
            });
        }
      },
    );
  }
}
