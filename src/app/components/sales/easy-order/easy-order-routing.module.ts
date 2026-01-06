import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EasyOrderComponent } from './easy-order.component';
import { DraftOrdersComponent } from './draft-orders/draft-orders.component';

const routes: Routes = [
  {
    path: '',
    component: EasyOrderComponent,
    data: {
      title: 'Easy Order',
    },
  },
  {
    path: 'draft-orders',
    component: DraftOrdersComponent,
    data: {
      title: 'Draft Orders',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EasyOrderRoutingModule {}
