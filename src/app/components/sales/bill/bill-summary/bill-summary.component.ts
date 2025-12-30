import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { SalesPayNowBottomSheetComponent } from 'src/app/components/shared/sales-pay-now-bottom-sheet/sales-pay-now-bottom-sheet.component';
import { ICustomerData } from 'src/app/interfaces/ICustomerData';
import { ICustomizeRouteData } from 'src/app/interfaces/ICustomizeRouteData';
import { IProductData } from 'src/app/interfaces/IProductData';
import { IResponse } from 'src/app/interfaces/IResponse';
import { IOrderItem, ISale } from 'src/app/interfaces/ISale';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { ProductService } from 'src/app/services/product/product.service';
import { RouteService } from 'src/app/services/route/route.service';
import { SaleService } from 'src/app/services/sale/sale.service';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { BaseBottomSheetDirective } from 'src/app/utility/directives/base-bottom-sheet.directive';
import {
  alertError,
  alertSuccess,
  errorMessageHandler,
} from 'src/app/utility/helper';
import { SweetAlertResult } from 'sweetalert2';

@UntilDestroy()
@Component({
  selector: 'app-bill-summary',
  templateUrl: './bill-summary.component.html',
  styleUrls: ['./bill-summary.component.scss'],
})
export class BillSummaryComponent
  extends BaseBottomSheetDirective
  implements OnInit
{
  protected routeDetails: ICustomizeRouteData | null = null;
  protected customerDetails: Partial<ICustomerData> | null = null;
  protected productList: IProductData[] = [];
  protected saleInitData: Record<string, string> | null = null;

  constructor(
    public override readonly bottomSheetService: NgxBottomSheetService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly routeService: RouteService,
    private readonly customerService: CustomerService,
    private readonly productService: ProductService,
    private readonly saleService: SaleService
  ) {
    super(bottomSheetService);
  }

  ngOnInit() {
    this.routeDetails = this.routeService.getSelectedRoute();
    this.customerDetails = this.customerService.getSelectedCustomer();
    this.productList = this.productService.getSelectedProductList();
    this.saleInitData = this.saleService.getSaleInitData();
  }

  protected getTotalAmount(): number {
    return this.productList.reduce(
      (sum, p) => sum + (p.selectedQuantity * p.selectedPrice || 0),
      0
    );
  }

  protected getGrandTotalAmount(): number {
    return this.getTotalAmount() + (this.customerDetails?.overdue || 0);
  }

  protected editOrder(): void {
    this.bottomSheetService.close();
  }

  protected confirmOrder(): void {
    const orderProductList: IOrderItem[] = this.productList.map((product) => {
      return {
        productId: product.productId,
        quantity: product.selectedQuantity,
        sellingPrice: product.selectedPrice,
      };
    });

    const payload: ISale = {
      orderId: Number(this.saleInitData?.['orderId']!),
      referenceNumber: this.saleInitData?.['orderReferenceNumber']!,
      itemDTOList: orderProductList,
    };

    this.saleService
      .placeOrder(payload)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.saleService.setSaleCompleteData(res.body.content);

            alertSuccess(
              {
                title: RESPONSE_MESSAGES.ORDER_ADD_SUCCESS,
                text: RESPONSE_MESSAGES.ORDER_ADD_QUESTION,
                showCancelButton: true,
                confirmButtonText: 'Yes, Now',
                cancelButtonText: 'No, Later',
              },
              (result: SweetAlertResult<any>) => {
                if (result.isConfirmed) {
                  this.bottomSheetService.open(
                    SalesPayNowBottomSheetComponent,
                    {
                      height: '515px',
                      showCloseButton: false,
                      backgroundColor: '#fff',
                    }
                  );
                }
              }
            );

            this.bottomSheetService.close();
            this.router.navigate(['sales/post-login'], {
              relativeTo: this.route,
            });
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.ORDER_ADD_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }
}
