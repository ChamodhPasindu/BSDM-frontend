import { Component } from '@angular/core';
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

  protected readonly UserRoles = UserRole;
  protected readonly userRole = this.storageService.get(SESSION_DATA.ROLE)!;

  constructor(private readonly storageService: StorageService) {
    if (this.userRole === UserRole.ADMIN) {
      this.navItems = this.navItems.filter(
        (item) => item.name !== 'Sales & Delivery'
      );
    }
  }
}
