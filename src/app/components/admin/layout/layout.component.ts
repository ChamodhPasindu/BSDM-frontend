import { Component } from '@angular/core';
import { navItems } from 'src/app/utility/common/_nav';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  protected readonly navItems = navItems;
}
