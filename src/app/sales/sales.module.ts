import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { LoginComponent } from './login/login.component';
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
  ModalFooterComponent,
  NavbarComponent,
  CarouselComponent,
  CarouselItemComponent,
  CollapseModule,
  AccordionModule,
  
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from './layout/layout.component';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { SettingsComponent } from './settings/settings.component';
import { RouteComponent } from './route/route.component';
import { NewComponent } from './customer/new/new.component';
import { ExistingComponent } from './customer/existing/existing.component';
import { BillSummaryComponent } from './customer/bill-summary/bill-summary.component';

@NgModule({
  declarations: [
    LoginComponent,
    LayoutComponent,
    HomeComponent,
    ProductComponent,
    RouteComponent,
    SettingsComponent,
    NewComponent,
    ExistingComponent,
    BillSummaryComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    FormsModule,
    IconModule,
    NgScrollbarModule,
    BsDatepickerModule,
    ChartjsModule,
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
    ModalFooterComponent,
    IconDirective,
    NavbarComponent,
    SharedModule,
    CarouselComponent,
    CarouselItemComponent,
    CollapseModule,
    AccordionModule,
  ],
})
export class SalesModule {}
