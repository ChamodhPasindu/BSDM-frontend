import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule,RouterModule ],
  declarations: [AdminSidebarComponent, AdminHeaderComponent],
  exports: [AdminSidebarComponent, AdminHeaderComponent],
})
export class SharedModule {}
