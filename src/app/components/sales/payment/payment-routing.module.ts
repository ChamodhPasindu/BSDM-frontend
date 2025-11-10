import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PaymentComponent } from "./payment.component";
import { SelectRouteComponent } from "./select-route/select-route.component";
import { SelectCustomerComponent } from "./select-customer/select-customer.component";
import { SelectBillComponent } from "./select-bill/select-bill.component";

const routes: Routes = [
    {
      path: '',
      component: PaymentComponent,
      children: [
        { path: 'select-route', component: SelectRouteComponent },
        { path: 'select-customer', component: SelectCustomerComponent },
        { path: 'select-bill', component: SelectBillComponent },
        { path: '', redirectTo: 'select-route', pathMatch: 'full' },
      ],
    },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class PaymentRoutingModule {}