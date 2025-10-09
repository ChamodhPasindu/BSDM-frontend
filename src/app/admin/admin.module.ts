import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { EmployeeManagementComponent } from './employee-management/employee-management.component';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
  declarations: [
    LoginComponent,
    LayoutComponent,
    DashboardComponent,
    EmployeeManagementComponent
  ],
  imports: [CommonModule, AdminRoutingModule, ReactiveFormsModule,SharedModule],
  
})
export class AdminModule {}
