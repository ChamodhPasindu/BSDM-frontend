import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {
  isSidebarOpen = false;
  constructor() { }

  ngOnInit() {
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    const overlay = document.querySelector('.sidebar-overlay') as HTMLElement;

    if (this.isSidebarOpen) {
      sidebar.classList.add('active');
      if (overlay) overlay.classList.add('active');
    } else {
      sidebar.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
    }
  }

}
