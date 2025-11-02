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
import { VehicleManagementComponent } from './vehicle-management/vehicle-management.component';
import { SalesStockComponent } from './inventory-management/sales-stock/sales-stock.component';
import { ReturnStockComponent } from './inventory-management/return-stock/return-stock.component';
import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import { PaymentsComponent } from './payments/payments.component';
import { SalesDeliveryTrackingComponent } from './sales-delivery-tracking/sales-delivery-tracking.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'post-login',
    component: LayoutComponent,
    data: {
      title: 'Home',
    },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Add this
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          title: 'Dashboard',
        },
      },
      {
        path: 'employees',
        component: EmployeeManagementComponent,
        data: {
          title: 'Employee',
        },
      },
      {
        path: 'customer-routes',
        component: CustomerRoutesComponent,
        data: {
          title: 'Customer & Routes',
        },
      },
      {
        path: 'vehicles',
        component: VehicleManagementComponent,
        data: {
          title: 'Vehicle',
        },
      },
      {
        path: 'alerts',
        component: AlertManagementComponent,
        data: {
          title: 'Alert',
        },
      },
      {
        path: 'audit-trail',
        component: AuditTrailComponent,
        data: {
          title: 'Audit Trail',
        },
      },
      {
        path: 'payments',
        component: PaymentsComponent,
        data: {
          title: 'Payment',
        },
      },
      {
        path: 'sales-delivery-tracking',
        component: SalesDeliveryTrackingComponent,
        data: {
          title: 'Sales & Delivery',
        },
      },
      {
        path: 'inventory',
        loadChildren: () =>
          import('./inventory-management/inventory-management.module').then(
            (m) => m.InventoryManagementModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
