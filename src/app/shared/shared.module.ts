import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Footer } from './footer/footer';
import { AdminReportExploreComponent } from './admin-report-explore/admin-report-explore.component';

@NgModule({
  imports: [CommonModule, RouterModule, MatIconModule],
  declarations: [
    AdminSidebarComponent,
    AdminHeaderComponent,
    Footer,
    AdminReportExploreComponent,
  ],
  exports: [
    AdminSidebarComponent,
    AdminHeaderComponent,
    Footer,
    AdminReportExploreComponent,
  ],
})
export class SharedModule {}
