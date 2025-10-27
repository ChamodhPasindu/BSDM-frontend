import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {
  selectedMenu:string ="home";
  selectedSub:string ="1";
  constructor() { }

  ngOnInit() {
  }

}
