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
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginComponent],
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
    IconDirective
  ],
})
export class SalesModule {}
