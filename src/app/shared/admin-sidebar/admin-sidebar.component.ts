import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {
  selectedMenu:string | null ="home";
  selectedSub:string ="1";
  
  constructor(private router: Router) {}
  ngOnInit() {
  }

  protected containsInUrl(keyword: string): boolean {
    console.log(this.router.url.includes(keyword));
    
    return this.router.url.includes(keyword);
  }
  
}
