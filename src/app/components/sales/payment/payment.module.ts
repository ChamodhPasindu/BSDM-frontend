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
  AvatarModule,
  BadgeModule,
  PaginationComponent,
  PageItemDirective,
  PageLinkDirective,
  ButtonDirective,
} from '@coreui/angular';
import { IconDirective, IconModule } from '@coreui/icons-angular';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    PaymentRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    IconModule,
    ButtonModule,
    CardModule,
    FormModule,
    GridModule,
    AvatarModule,
    BadgeModule,
    PaginationComponent,
    PageItemDirective,
    PageLinkDirective,
    ButtonDirective,
    IconDirective,
    SharedModule,
  ],
  declarations: [
    PaymentComponent,
    SelectRouteComponent,
    SelectCustomerComponent,
    SelectBillComponent,
  ],
})
export class PaymentModule {}
