import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [CommonModule, RouterModule, MatIconModule],
  declarations: [AdminSidebarComponent, AdminHeaderComponent],
  exports: [AdminSidebarComponent, AdminHeaderComponent],
})
export class SharedModule {}
