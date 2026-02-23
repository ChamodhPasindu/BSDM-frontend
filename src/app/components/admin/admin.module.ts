import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { EmployeeComponent } from './employee/employee.component';
import { LayoutComponent } from './layout/layout.component';
import { AlertComponent } from './alert/alert.component';
import { CustomerRoutesComponent } from './customer-routes/customer-routes.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import { PaymentsComponent } from './payments/payments.component';
import { SalesDeliveryComponent } from './sales-delivery/sales-delivery.component';
import {
  SidebarModule,
  AlertComponent as CoreUIAlertComponent,
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
import { AlertViewComponent } from './alert/alert-view/alert-view.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SettingsComponent } from './settings/settings.component';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { VehicleService } from 'src/app/services/vehicle/vehicle.service';
import { AddEditViewEmployeeComponent } from './employee/add-edit-view-employee/add-edit-view-employee.component';
import { AddEditViewVehicleComponent } from './vehicle/add-edit-view-vehicle/add-edit-view-vehicle.component';
import { AddEditViewCustomerComponent } from './customer-routes/add-edit-view-customer/add-edit-view-customer.component';
import { AddEditViewRouteComponent } from './customer-routes/add-edit-view-route/add-edit-view-route.component';
import { EditViewPaymentComponent } from './payments/edit-view-payment/edit-view-payment.component';
import { ViewSaleComponent } from './sales-delivery/view-sale/view-sale.component';
import { ViewSaleItemComponent } from './sales-delivery/view-sale-item/view-sale-item.component';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { AuditTrailService } from 'src/app/services/audit-trail/audit-trail.service';

@NgModule({
  declarations: [
    LoginComponent,
    LayoutComponent,
    DashboardComponent,
    CustomerRoutesComponent,
    AddEditViewCustomerComponent,
    AddEditViewRouteComponent,
    AlertComponent,
    EmployeeComponent,
    AddEditViewEmployeeComponent,
    VehicleComponent,
    AddEditViewVehicleComponent,
    AuditTrailComponent,
    PaymentsComponent,
    EditViewPaymentComponent,
    SalesDeliveryComponent,
    ViewSaleComponent,
    ViewSaleItemComponent,
    ViewAuditComponent,
    AlertViewComponent,
    SettingsComponent,
  ],
  imports: [
    AdminRoutingModule,
    SharedModule,
    SidebarModule,
    NgScrollbarModule,
    CoreUIAlertComponent,
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
  providers: [
    EmployeeService,
    VehicleService,
    DashboardService,
    AuditTrailService,
  ],
})
export class AdminModule {}
