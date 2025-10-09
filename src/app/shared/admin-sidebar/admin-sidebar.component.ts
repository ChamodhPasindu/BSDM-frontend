import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  closeSidebarOnMobile() {
    // Only close sidebar on mobile devices
    if (window.innerWidth <= 768) {
      this.closeSidebar();
    }
  }

  closeSidebar() {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    const overlay = document.querySelector('.sidebar-overlay') as HTMLElement;
    
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  }

}
