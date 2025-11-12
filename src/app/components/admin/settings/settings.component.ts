import { Component, OnInit } from '@angular/core';
import { alertWarning } from 'src/app/utility/helper';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  protected delete() {
    alertWarning({
      title: 'Confirm Delete',
      text: 'message',
    });
  }

  protected users: any[] = [];
  protected pagedUsers: any[] = [];

  protected currentPage = 1;
  protected pageSize = 5;

  ngOnInit(): void {
    // sample data
    this.users = Array.from({ length: 35 }, (_, i) => ({
      name: `User ${i + 1}`,
      nic: `NIC${1000 + i}`,
    }));

    this.updatePagedUsers();
  }

  protected goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagedUsers();
  }

  protected onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.updatePagedUsers();
  }

  protected updatePagedUsers(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedUsers = this.users.slice(start, end);
  }
}
