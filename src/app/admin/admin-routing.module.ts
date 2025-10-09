import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeManagementComponent } from './employee-management/employee-management.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'post-login',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Add this
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employees', component: EmployeeManagementComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
