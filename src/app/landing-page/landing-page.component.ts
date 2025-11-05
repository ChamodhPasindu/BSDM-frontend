import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {

  constructor(private router: Router) {}

  navigateTo(role: string) {
    if (role === 'admin') this.router.navigate(['admin']);
    else this.router.navigate(['/sales/login']);
  }

}
