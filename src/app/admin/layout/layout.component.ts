import { Component, OnInit } from '@angular/core';
import { navItems } from 'src/utils/icons/_nav';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  public navItems = navItems;
  constructor() {}

  ngOnInit() {}
}
