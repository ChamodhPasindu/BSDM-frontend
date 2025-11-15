import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { EmployeeManagementComponent } from './employee-management/employee-management.component';
import { LayoutComponent } from './layout/layout.component';
import { AlertManagementComponent } from './alert-management/alert-management.component';
import { CustomerRoutesComponent } from './customer-routes/customer-routes.component';
import { VehicleManagementComponent } from './vehicle-management/vehicle-management.component';
import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import { PaymentsComponent } from './payments/payments.component';
import { SalesDeliveryTrackingComponent } from './sales-delivery-tracking/sales-delivery-tracking.component';
import {
  SidebarModule,
  AlertComponent,
  WidgetStatFComponent,
  WidgetModule,
  DropdownModule,
  ProgressModule,
  ButtonGroupModule,
  TableModule,
  BadgeModule,
  ModalBodyComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalFooterComponent,
} from '@coreui/angular';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { EmployeeViewComponent } from './employee-management/employee-view/employee-view.component';
import { ViewVehicleComponent } from './vehicle-management/view-vehicle/view-vehicle.component';
import { CustomerViewComponent } from './customer-routes/customer-view/customer-view.component';
import { RouteViewComponent } from './customer-routes/route-view/route-view.component';
import { ViewAuditComponent } from './audit-trail/view-audit/view-audit.component';
import { AlertViewComponent } from './alert-management/alert-view/alert-view.component';
import { ViewPaymentComponent } from './payments/view-payment/view-payment.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SettingsComponent } from './settings/settings.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';

@NgModule({
  declarations: [
    LoginComponent,
    LayoutComponent,
    DashboardComponent,
    CustomerRoutesComponent,
    AlertManagementComponent,
    EmployeeManagementComponent,
    VehicleManagementComponent,
    AuditTrailComponent,
    PaymentsComponent,
    SalesDeliveryTrackingComponent,
    EmployeeViewComponent,
    ViewVehicleComponent,
    CustomerViewComponent,
    RouteViewComponent,
    ViewAuditComponent,
    AlertViewComponent,
    ViewPaymentComponent,
    SettingsComponent,
  ],
  imports: [
    AdminRoutingModule,
    SharedModule,
    SidebarModule,
    NgScrollbarModule,
    AlertComponent,
    WidgetModule,
    DropdownModule,
    ProgressModule,
    ChartjsModule,
    WidgetStatFComponent,
    ButtonGroupModule,
    TableModule,
    BadgeModule,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    BsDatepickerModule.forRoot(),
    NgSelectModule,
  ],
  providers: [EmployeeService],
})
export class AdminModule {}
