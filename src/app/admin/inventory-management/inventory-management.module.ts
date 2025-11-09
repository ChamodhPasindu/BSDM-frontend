import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product/product.component';
import { SalesStockComponent } from './sales-stock/sales-stock.component';
import { StockComponent } from './stock/stock.component';
import { ReturnStockComponent } from './return-stock/return-stock.component';
import { InventoryManagementRoutingModule } from './inventory-management.routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ItemBatchComponent } from './item-batch/item-batch.component';
import {
  CardModule,
  GridModule,
  ButtonModule,
  FormModule,
  BadgeModule,
  PageLinkDirective,
  ButtonCloseDirective,
  ButtonDirective,
  SidebarModule,
  AlertComponent,
  WidgetStatFComponent,
  UtilitiesModule,
  DropdownModule,
  ProgressModule,
  TemplateIdDirective,
  ButtonGroupModule,
  ModalTitleDirective,
  WidgetModule,
  TableModule,
  AvatarModule,
  PaginationComponent,
  PageItemDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalFooterComponent,
  AccordionComponent,
  AccordionItemComponent,
  AccordionModule,
} from '@coreui/angular';
import { ViewBatchComponent } from './item-batch/view-batch/view-batch.component';
import { ViewItemComponent } from './item-batch/view-item/view-item.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { IconDirective, IconModule } from '@coreui/icons-angular';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { ViewProductComponent } from './product/view-product/view-product.component';
import { ViewStockComponent } from './stock/view-stock/view-stock.component';
import { ViewSaleStockComponent } from './sales-stock/view-sale-stock/view-sale-stock.component';
import { ViewReturnStockComponent } from './return-stock/view-return-stock/view-return-stock.component';
import { NgSelectModule } from '@ng-select/ng-select';

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
    CommonModule,
    InventoryManagementRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    NgChartsModule,
    CardModule,
    ButtonModule,
    GridModule,
    IconModule,
    FormModule,
    SidebarModule,
    NgScrollbarModule,
    UtilitiesModule,
    AlertComponent,
    WidgetModule,
    DropdownModule,
    ProgressModule,
    ChartjsModule,
    IconDirective,
    TemplateIdDirective,
    WidgetStatFComponent,
    ButtonGroupModule,
    TableModule,
    AvatarModule,
    BadgeModule,
    PaginationComponent,
    PageItemDirective,
    PageLinkDirective,
    FormsModule,
    ButtonDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalFooterComponent,
    AccordionComponent,
    AccordionItemComponent,
    AccordionModule,
    NgSelectModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class InventoryManagementModule {}
