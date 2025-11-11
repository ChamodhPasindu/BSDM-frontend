import { NgModule } from '@angular/core';
import { PaymentComponent } from './payment.component';
import { PaymentRoutingModule } from './payment-routing.module';
import { SelectCustomerComponent } from './select-customer/select-customer.component';
import { SelectBillComponent } from './select-bill/select-bill.component';
import { SelectRouteComponent } from './select-route/select-route.component';
import { BadgeModule } from '@coreui/angular';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    PaymentComponent,
    SelectRouteComponent,
    SelectCustomerComponent,
    SelectBillComponent,
  ],
  imports: [PaymentRoutingModule, SharedModule, BadgeModule],
})
export class PaymentModule {}
