import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillComponent } from './bill.component';
import { BillRoutingModule } from './bill-routing.module';
import {
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  ProgressModule,
  AvatarModule,
  BadgeModule,
  PaginationComponent,
  PageItemDirective,
  PageLinkDirective,
  ButtonDirective,
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import { IconDirective } from '@coreui/icons-angular';
import { SelectRouteComponent } from './select-route/select-route.component';
import { SelectExistingCustomerComponent } from './select-existing-customer/select-existing-customer.component';
import { SelectNewCustomerComponent } from './select-new-customer/select-new-customer.component';
import { SelectProductComponent } from './select-product/select-product.component';
import { BillSummaryComponent } from './bill-summary/bill-summary.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    BillRoutingModule,
    FormsModule,
    IconModule,
    ButtonModule,
    CardModule,
    FormModule,
    GridModule,
    ProgressModule,
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
    BillComponent,
    SelectRouteComponent,
    SelectExistingCustomerComponent,
    SelectNewCustomerComponent,
    SelectProductComponent,
    BillSummaryComponent,
  ],
})
export class BillModule {}
