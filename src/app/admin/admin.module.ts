import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { EmployeeManagementComponent } from './employee-management/employee-management.component';
import { LayoutComponent } from './layout/layout.component';
import { NgChartsModule } from 'ng2-charts';
import { AlertManagementComponent } from './alert-management/alert-management.component';
import { CustomerRoutesComponent } from './customer-routes/customer-routes.component';
import { StockComponent } from './inventory-management/stock/stock.component';
import { ProductComponent } from './inventory-management/product/product.component';
import { VehicleManagementComponent } from './vehicle-management/vehicle-management.component';
import { SalesStockComponent } from './inventory-management/sales-stock/sales-stock.component';
import { ReturnStockComponent } from './inventory-management/return-stock/return-stock.component';

@NgModule({
  declarations: [
    LoginComponent,
    LayoutComponent,
    DashboardComponent,
    CustomerRoutesComponent,
    AlertManagementComponent,
    EmployeeManagementComponent,
    VehicleManagementComponent,
    StockComponent,
    ProductComponent,
    SalesStockComponent,
    ReturnStockComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    NgChartsModule,
  ],
})
export class AdminModule {}
