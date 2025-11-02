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
import { VehicleManagementComponent } from './vehicle-management/vehicle-management.component';
import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import { PaymentsComponent } from './payments/payments.component';
import { SalesDeliveryTrackingComponent } from './sales-delivery-tracking/sales-delivery-tracking.component';
import {
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  SidebarModule,
  AlertComponent,
  WidgetStatFComponent,
  UtilitiesModule,
  WidgetModule,
  DropdownModule,
  ProgressModule,
  TemplateIdDirective,
  ButtonGroupModule,
  TableModule,
  AvatarModule,
  BadgeModule,
  PaginationComponent,
  PageItemDirective,
  PageLinkDirective,
  ButtonCloseDirective,
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalFooterComponent
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { EmployeeViewComponent } from './employee-management/employee-view/employee-view.component';
import { ViewVehicleComponent } from './vehicle-management/view-vehicle/view-vehicle.component';
import { CustomerViewComponent } from './customer-routes/customer-view/customer-view.component';
import { RouteViewComponent } from './customer-routes/route-view/route-view.component';
import { ViewAuditComponent } from './audit-trail/view-audit/view-audit.component';
import { AlertViewComponent } from './alert-management/alert-view/alert-view.component';

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
    AlertViewComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    NgChartsModule,
    CardModule,
    ButtonModule,
    GridModule,
    IconModule,
    FormModule,
    SidebarModule,
    NgScrollbarModule,
    UtilitiesModule,
    AlertComponent,
    WidgetModule,
    DropdownModule,
    ProgressModule,
    ChartjsModule,
    IconDirective,
    TemplateIdDirective,
    WidgetStatFComponent,
    ButtonGroupModule,
    TableModule,
    AvatarModule,
    BadgeModule,
    PaginationComponent,
    PageItemDirective,
    PageLinkDirective,
    FormsModule,
    ButtonDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalFooterComponent,
    BsDatepickerModule.forRoot(),
  ],
})
export class AdminModule {}
