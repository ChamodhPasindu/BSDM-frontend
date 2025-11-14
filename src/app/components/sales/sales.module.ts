import { NgModule } from '@angular/core';

import { SalesRoutingModule } from './sales-routing.module';
import { LoginComponent } from './login/login.component';
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
  NavbarComponent,
  CarouselComponent,
  CarouselItemComponent,
  CollapseModule,
  AccordionModule,
} from '@coreui/angular';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LayoutComponent } from './layout/layout.component';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { SettingsComponent } from './settings/settings.component';
import { RouteComponent } from './route/route.component';
import { NotificationComponent } from './notification/notification.component';
import { AuthService } from 'src/app/services/auth/auth.service';

@NgModule({
  declarations: [
    LoginComponent,
    LayoutComponent,
    HomeComponent,
    ProductComponent,
    RouteComponent,
    SettingsComponent,
    NotificationComponent,
  ],
  imports: [
    SalesRoutingModule,
    NgScrollbarModule,
    BsDatepickerModule,
    ChartjsModule,
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
    NavbarComponent,
    SharedModule,
    CarouselComponent,
    CarouselItemComponent,
    CollapseModule,
    AccordionModule,
  ],
  providers: [AuthService],
})
export class SalesModule {}
