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
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { ViewSaleStockComponent } from './sales-stock/view-sale-stock/view-sale-stock.component';
import { ViewReturnStockComponent } from './return-stock/view-return-stock/view-return-stock.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ItemService } from 'src/app/services/item/item.service';
import { BatchService } from 'src/app/services/batch/batch.service';
import { StockService } from 'src/app/services/stock/stock.service';
import { SaleStockService } from 'src/app/services/sale-stock/sale-stock.service';
import { AddSaleStockComponent } from './sales-stock/add-sale-stock/add-sale-stock.component';
import { StockReturnService } from 'src/app/services/stock-return/stock-return.service';
import { AddReturnStockComponent } from './return-stock/add-return-stock/add-return-stock.component';
import { AddEditViewItemComponent } from './item-batch/add-edit-view-item/add-edit-view-item.component';
import { AddEditViewBatchComponent } from './item-batch/add-edit-view-batch/add-edit-view-batch.component';
import { AddViewProductComponent } from './product/add-view-product/add-view-product.component';
import { AddStockComponent } from './stock/add-stock/add-stock.component';
import { EditViewStockComponent } from './stock/edit-view-stock/edit-view-stock.component';
import { ReviewReturnStockComponent } from './return-stock/review-return-stock/review-return-stock.component';

@NgModule({
  declarations: [
    ProductComponent,
    AddViewProductComponent,
    SalesStockComponent,
    StockComponent,
    AddStockComponent,
    EditViewStockComponent,
    ReturnStockComponent,
    ItemBatchComponent,
    AddEditViewItemComponent,
    AddEditViewBatchComponent,
    ViewSaleStockComponent,
    AddSaleStockComponent,
    ViewReturnStockComponent,
    AddReturnStockComponent,
    ReviewReturnStockComponent,
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
  providers: [
    ItemService,
    BatchService,
    StockService,
    SaleStockService,
    StockReturnService,
  ],
})
export class InventoryManagementModule {}
