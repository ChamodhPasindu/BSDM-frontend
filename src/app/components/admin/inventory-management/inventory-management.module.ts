import { NgModule } from '@angular/core';
import { ProductComponent } from './product/product.component';
import { SalesStockComponent } from './sales-stock/sales-stock.component';
import { StockComponent } from './stock/stock.component';
import { ReturnStockComponent } from './return-stock/return-stock.component';
import { InventoryManagementRoutingModule } from './inventory-management.routing.module';
import { ItemBatchComponent } from './item-batch/item-batch.component';
import {
  BadgeModule,
  AlertComponent,
  WidgetStatFComponent,
  DropdownModule,
  ButtonGroupModule,
  WidgetModule,
  TableModule,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  AccordionComponent,
  AccordionItemComponent,
  AccordionModule,
} from '@coreui/angular';
import { ViewBatchComponent } from './item-batch/view-batch/view-batch.component';
import { ViewItemComponent } from './item-batch/view-item/view-item.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { ViewProductComponent } from './product/view-product/view-product.component';
import { ViewStockComponent } from './stock/view-stock/view-stock.component';
import { ViewSaleStockComponent } from './sales-stock/view-sale-stock/view-sale-stock.component';
import { ViewReturnStockComponent } from './return-stock/view-return-stock/view-return-stock.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    ProductComponent,
    SalesStockComponent,
    StockComponent,
    ReturnStockComponent,
    ItemBatchComponent,
    ViewBatchComponent,
    ViewItemComponent,
    ViewProductComponent,
    ViewStockComponent,
    ViewSaleStockComponent,
    ViewReturnStockComponent,
  ],
  imports: [
    InventoryManagementRoutingModule,
    SharedModule,
    WidgetModule,
    DropdownModule,
    ChartjsModule,
    WidgetStatFComponent,
    ButtonGroupModule,
    TableModule,
    BadgeModule,
    ModalComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    AccordionComponent,
    AccordionItemComponent,
    AlertComponent,
    AccordionModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
  ],
})
export class InventoryManagementModule {}
