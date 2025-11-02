import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { RouterModule } from '@angular/router';
import { Footer } from './footer/footer';
import { AdminReportExploreComponent } from './admin-report-explore/admin-report-explore.component';
import {
  BadgeComponent,
  NavItemComponent,
  BreadcrumbRouterComponent,
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
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { NgScrollbarModule } from 'ngx-scrollbar';

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
    SidebarModule,
    IconModule,
    NavModule,
    ButtonModule,
    FormModule,
    UtilitiesModule,
    ButtonGroupModule,
    SidebarModule,
    TabsModule,
    ListGroupModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    CardModule,
    NgScrollbarModule,
    NavbarTextComponent,
  ],
  declarations: [AdminHeaderComponent, Footer, AdminReportExploreComponent],
  exports: [AdminHeaderComponent, Footer, AdminReportExploreComponent],
})
export class SharedModule {}
