import { NgModule } from '@angular/core';
import { BillComponent } from './bill.component';
import { BillRoutingModule } from './bill-routing.module';
import { ProgressModule, BadgeModule } from '@coreui/angular';
import { SelectRouteComponent } from './select-route/select-route.component';
import { SelectExistingCustomerComponent } from './select-existing-customer/select-existing-customer.component';
import { SelectNewCustomerComponent } from './select-new-customer/select-new-customer.component';
import { SelectProductComponent } from './select-product/select-product.component';
import { BillSummaryComponent } from './bill-summary/bill-summary.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    BillComponent,
    SelectRouteComponent,
    SelectExistingCustomerComponent,
    SelectNewCustomerComponent,
    SelectProductComponent,
    BillSummaryComponent,
  ],
  imports: [BillRoutingModule, SharedModule, ProgressModule, BadgeModule],
})
export class BillModule {}
