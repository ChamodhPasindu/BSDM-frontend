import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillComponent } from './bill.component';
import { SelectRouteComponent } from './select-route/select-route.component';
import { SelectExistingCustomerComponent } from './select-existing-customer/select-existing-customer.component';
import { SelectProductComponent } from './select-product/select-product.component';
import { SelectNewCustomerComponent } from './select-new-customer/select-new-customer.component';

const routes: Routes = [
  {
    path: '',
    component: BillComponent,
    children: [
      {
        path: 'select-route',
        component: SelectRouteComponent,
        data: {
          title: 'Route',
        },
      },
      {
        path: 'existing-customer',
        component: SelectExistingCustomerComponent,
        data: {
          title: 'Existing Customer',
        },
      },
      {
        path: 'new-customer',
        component: SelectNewCustomerComponent,
        data: {
          title: 'New Customer',
        },
      },
      {
        path: 'select-product',
        component: SelectProductComponent,
        data: {
          title: 'Products',
        },
      },
      { path: '', redirectTo: 'select-route', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillRoutingModule {}
