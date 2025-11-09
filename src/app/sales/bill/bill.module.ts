import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillComponent } from './bill.component';
import { BillRoutingModule } from './bill-routing.module';
import {
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  SidebarModule,
  AlertComponent,
  WidgetStatFComponent,
  UtilitiesModule,
  WidgetModule,
  DropdownModule,
  ProgressModule,
  TemplateIdDirective,
  ButtonGroupModule,
  TableModule,
  AvatarModule,
  BadgeModule,
  PaginationComponent,
  PageItemDirective,
  PageLinkDirective,
  ButtonCloseDirective,
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalFooterComponent,
  NavbarComponent,
  CarouselComponent,
  CarouselItemComponent,
  CollapseModule,
  AccordionModule,
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { IconModule } from '@coreui/icons-angular';
import { IconDirective } from '@coreui/icons-angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelectRouteComponent } from './select-route/select-route.component';
import { SelectExistingCustomerComponent } from './select-existing-customer/select-existing-customer.component';
import { SelectNewCustomerComponent } from './select-new-customer/select-new-customer.component';
import { SelectProductComponent } from './select-product/select-product.component';
import { BillSummaryComponent } from './bill-summary/bill-summary.component';

@NgModule({
  imports: [
    CommonModule,
    BillRoutingModule,
    FormsModule,
    IconModule,
    NgScrollbarModule,
    ButtonModule,
    CardModule,
    FormModule,
    GridModule,
    SidebarModule,
    AlertComponent,
    WidgetStatFComponent,
    UtilitiesModule,
    WidgetModule,
    DropdownModule,
    ProgressModule,
    TemplateIdDirective,
    ButtonGroupModule,
    TableModule,
    AvatarModule,
    BadgeModule,
    PaginationComponent,
    PageItemDirective,
    PageLinkDirective,
    ButtonCloseDirective,
    ButtonDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalFooterComponent,
    IconDirective,
    NavbarComponent,
    SharedModule,
    CarouselComponent,
    CarouselItemComponent,
    CollapseModule,
    AccordionModule,
  ],
  declarations: [
    BillComponent,
    SelectRouteComponent,
    SelectExistingCustomerComponent,
    SelectNewCustomerComponent,
    SelectProductComponent,
    BillSummaryComponent
  ],
})
export class BillModule {}
