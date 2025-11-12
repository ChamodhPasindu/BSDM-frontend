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
  PaginationComponent,
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SalesHeaderComponent } from './sales-header/sales-header.component';
import { SalesBottomNavComponent } from './sales-bottom-nav/sales-bottom-nav.component';
import { SalesPayNowBottomSheetComponent } from './sales-pay-now-bottom-sheet/sales-pay-now-bottom-sheet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesPaymentSummaryBottomSheetComponent } from './sales-payment-summary-bottom-sheet/sales-payment-summary-bottom-sheet.component';
import { SalesQuickMenuBottomSheetComponent } from './sales-quick-menu-bottom-sheet/sales-quick-menu-bottom-sheet.component';
import { SalesEmptyDataComponent } from './sales-empty-data/sales-empty-data.component';
import { SharedDirectiveModule } from './shared-directive.module';
import { PaginatorComponent } from './paginator/paginator.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FormModule,
    IconModule,
    GridModule,
    ButtonModule,
    UtilitiesModule,
    CardModule,
    AvatarModule,
    PaginationComponent,

    BreadcrumbModule,
    FooterModule,
    DropdownModule,
    HeaderModule,
    NavModule,
    ButtonGroupModule,
    SidebarModule,
    TabsModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    NgScrollbarModule,
    NavbarTextComponent,
    AlertComponent,
    SharedDirectiveModule,
  ],
  declarations: [
    AdminHeaderComponent,
    Footer,
    SalesHeaderComponent,
    SalesBottomNavComponent,
    SalesPayNowBottomSheetComponent,
    SalesPaymentSummaryBottomSheetComponent,
    SalesQuickMenuBottomSheetComponent,
    SalesEmptyDataComponent,
    PaginatorComponent
  ],
  exports: [
    AdminHeaderComponent,
    Footer,
    SalesHeaderComponent,
    SalesBottomNavComponent,
    SalesPayNowBottomSheetComponent,
    SalesPaymentSummaryBottomSheetComponent,
    SalesQuickMenuBottomSheetComponent,
    SalesEmptyDataComponent,
    SharedDirectiveModule,
    PaginatorComponent,

    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FormModule,
    IconModule,
    GridModule,
    ButtonModule,
    UtilitiesModule,
    CardModule,
    AvatarModule,
    PaginationComponent,
  ],
})
export class SharedModule {}
