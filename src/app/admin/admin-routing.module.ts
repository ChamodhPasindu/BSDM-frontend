import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeManagementComponent } from './employee-management/employee-management.component';
import { LayoutComponent } from './layout/layout.component';
import { CustomerRoutesComponent } from './customer-routes/customer-routes.component';
import { AlertManagementComponent } from './alert-management/alert-management.component';
import { ProductComponent } from './inventory-management/product/product.component';
import { StockComponent } from './inventory-management/stock/stock.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'post-login',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Add this
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employees', component: EmployeeManagementComponent },
      { path: 'customer-routes', component: CustomerRoutesComponent },
      { path: 'alerts', component: AlertManagementComponent },
      { path: 'inventory/product', component: ProductComponent },
      { path: 'inventory/stock', component: StockComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
