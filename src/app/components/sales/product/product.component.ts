import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IProductData } from 'src/app/interfaces/IProductData';
import { IResponse } from 'src/app/interfaces/IResponse';
import { ProductService } from 'src/app/services/product/product.service';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { alertError, errorMessageHandler } from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  protected productList: IProductData[] = [];

  constructor(private readonly productService: ProductService) {}

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
}
