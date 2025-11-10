import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { RouterModule } from '@angular/router';
import { Footer } from './footer/footer';
import {
  ButtonGroupModule,
  GridModule,
  DropdownModule,
  AvatarModule,
  ButtonModule,
  HeaderModule,
  SidebarModule,
  BadgeModule,
  BreadcrumbModule,
  CardModule,
  FooterModule,
  FormModule,
  ListGroupModule,
  NavModule,
  ProgressModule,
  TabsModule,
  UtilitiesModule,
  NavbarTextComponent,
  AlertComponent,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SalesHeaderComponent } from './sales-header/sales-header.component';
import { SalesBottomNavComponent } from './sales-bottom-nav/sales-bottom-nav.component';
import { SalesPayNowBottomSheetComponent } from './sales-pay-now-bottom-sheet/sales-pay-now-bottom-sheet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesPaymentSummaryBottomSheetComponent } from './sales-payment-summary-bottom-sheet/sales-payment-summary-bottom-sheet.component';
import { SalesQuickMenuBottomSheetComponent } from './sales-quick-menu-bottom-sheet/sales-quick-menu-bottom-sheet.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AvatarModule,
    BreadcrumbModule,
    FooterModule,
    DropdownModule,
    GridModule,
    HeaderModule,
    IconModule,
    NavModule,
    ButtonModule,
    FormModule,
    UtilitiesModule,
    ButtonGroupModule,
    SidebarModule,
    TabsModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    CardModule,
    NgScrollbarModule,
    NavbarTextComponent,
    FormsModule,
    ReactiveFormsModule,
    AlertComponent,
  ],
  declarations: [
    AdminHeaderComponent,
    Footer,
    SalesHeaderComponent,
    SalesBottomNavComponent,
    SalesPayNowBottomSheetComponent,
    SalesPaymentSummaryBottomSheetComponent,
    SalesQuickMenuBottomSheetComponent,
  ],
  exports: [
    AdminHeaderComponent,
    Footer,
    SalesHeaderComponent,
    SalesBottomNavComponent,
    SalesPayNowBottomSheetComponent,
    SalesPaymentSummaryBottomSheetComponent,
    SalesQuickMenuBottomSheetComponent,
  ],
})
export class SharedModule {}
