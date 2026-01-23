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
import { ViewAuditComponent } from './audit-trail/view-audit/view-audit.component';
import { AlertViewComponent } from './alert-management/alert-view/alert-view.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SettingsComponent } from './settings/settings.component';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { VehicleService } from 'src/app/services/vehicle/vehicle.service';
import { AddEditViewEmployeeComponent } from './employee-management/add-edit-view-employee/add-edit-view-employee.component';
import { AddEditViewVehicleComponent } from './vehicle-management/add-edit-view-vehicle/add-edit-view-vehicle.component';
import { AddEditViewCustomerComponent } from './customer-routes/add-edit-view-customer/add-edit-view-customer.component';
import { AddEditViewRouteComponent } from './customer-routes/add-edit-view-route/add-edit-view-route.component';
import { EditViewPaymentComponent } from './payments/edit-view-payment/edit-view-payment.component';

@NgModule({
  declarations: [
    LoginComponent,
    LayoutComponent,
    DashboardComponent,
    CustomerRoutesComponent,
    AddEditViewCustomerComponent,
    AddEditViewRouteComponent,
    AlertManagementComponent,
    EmployeeManagementComponent,
    AddEditViewEmployeeComponent,
    VehicleManagementComponent,
    AddEditViewVehicleComponent,
    AuditTrailComponent,
    PaymentsComponent,
    EditViewPaymentComponent,
    SalesDeliveryTrackingComponent,
    ViewAuditComponent,
    AlertViewComponent,
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
  providers: [EmployeeService, VehicleService],
})
export class AdminModule {}
