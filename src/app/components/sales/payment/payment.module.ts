import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { PaymentRoutingModule } from './payment-routing.module';
import { SelectCustomerComponent } from './select-customer/select-customer.component';
import { SelectBillComponent } from './select-bill/select-bill.component';
import { SelectRouteComponent } from './select-route/select-route.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { IconDirective, IconModule } from '@coreui/icons-angular';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    PaymentRoutingModule,
    CommonModule,
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
    PaymentComponent,
    SelectRouteComponent,
    SelectCustomerComponent,
    SelectBillComponent,
  ],
})
export class PaymentModule {}
