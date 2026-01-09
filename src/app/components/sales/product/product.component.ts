import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IProductData } from 'src/app/interfaces/IProductData';
import { IResponse } from 'src/app/interfaces/IResponse';
import { ProductService } from 'src/app/services/product/product.service';
import { StockReturnService } from 'src/app/services/stock-return/stock-return.service';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import {
  alertError,
  alertSuccess,
  alertWarning,
  errorMessageHandler,
} from 'src/app/utility/helper';
import { SweetAlertResult } from 'sweetalert2';

@UntilDestroy()
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  protected productList: IProductData[] = [];

  constructor(
    private readonly productService: ProductService,
    private readonly stockReturnService: StockReturnService
  ) {}

  ngOnInit(): void {
    this.loadProductList();
  }

  private loadProductList(): void {
    this.productService
      .getSalesmanProductList()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.productList = res.body.content;
          } else {
            alertError({
              title: RESPONSE_TITLES.OOPS,
              text: res.body.message || RESPONSE_MESSAGES.PRODUCT_GET_FAILED,
            });
            this.productList = [];
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
          this.productList = [];
        },
      });
  }

  public returnAllProducts(): void {
    const remainingProductsTotal = this.productList.reduce(
      (acc, product) => acc + (product.availableQuantity || 0),
      0
    );

    alertWarning(
      {
        title: RESPONSE_TITLES.WARNING,
        text: RESPONSE_MESSAGES.RETURN_ALL_REMAINING_PRODUCT_CONFIRMATION.replace(
          '{number}',
          remainingProductsTotal.toString()
        ),
      },
      (result: SweetAlertResult<any>) => {
        if (result.isConfirmed) {
          this.stockReturnService
            .ReturnAllRemainingProduct()
            .pipe(untilDestroyed(this))
            .subscribe({
              next: (res: IResponse) => {
                if (res.body.status === RSP_SUCCESS) {
                  alertSuccess({
                    title: RESPONSE_TITLES.SUCCESS,
                    text: RESPONSE_MESSAGES.RETURN_STOCK_ADD_EDIT_SUCCESS,
                  });

                  this.loadProductList();
                } else {
                  alertError({
                    title: RESPONSE_TITLES.FAILED,
                    text:
                      res.body.message ||
                      RESPONSE_MESSAGES.RETURN_STOCK_ADD_EDIT_FAILED,
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
