import { NgModule } from '@angular/core';
import { EasyOrderComponent } from './easy-order.component';
import { DraftOrdersComponent } from './draft-orders/draft-orders.component';
import { EasyOrderRoutingModule } from './easy-order-routing.module';
import { BadgeModule, TooltipModule, CardModule, FormModule } from '@coreui/angular';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [EasyOrderComponent, DraftOrdersComponent],
  imports: [
    EasyOrderRoutingModule,
    SharedModule,
    BadgeModule,
    TooltipModule,
    CardModule,
    FormModule,
  ],
})
export class EasyOrderModule {}
