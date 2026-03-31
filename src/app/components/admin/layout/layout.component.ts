import { Component, HostListener } from '@angular/core';
import { UserRole } from 'src/app/enums/UserRole.enum';
import { StorageService } from 'src/app/services/storage.service';
import { navItems } from 'src/app/utility/common/_nav';
import { SESSION_DATA } from 'src/app/utility/constants/session-data';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  protected navItems = [...navItems];
  protected sidebarVisible = true;

  protected readonly UserRoles = UserRole;
  protected readonly userRole = this.storageService.get(SESSION_DATA.ROLE)!;

  constructor(private readonly storageService: StorageService) {
    if (this.userRole === UserRole.ADMIN) {
      this.navItems = this.navItems.filter(
        (item) => item.name !== 'Sales & Delivery'
      );
    }
  }

  protected onSidebarVisibleChange(visible: boolean): void {
    this.sidebarVisible = visible;
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.sidebarVisible || !window.matchMedia('(max-width: 767.98px)').matches) {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }

    const clickedBackdrop = !!target.closest('.sidebar-backdrop');
    const clickedInsideSidebar = !!target.closest('#sidebar');
    const clickedToggler = !!target.closest('[csidebartoggle], .header-toggler, [toggle="visible"]');

    if (clickedBackdrop || (!clickedInsideSidebar && !clickedToggler)) {
      this.sidebarVisible = false;
    }
  }
}
