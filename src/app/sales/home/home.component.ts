import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  totalCollapseVisible = false;

  toggleTotalCollapse() {
    this.totalCollapseVisible = !this.totalCollapseVisible;
  }
  constructor() {}

  ngOnInit() {}

  products = [
    { name: 'Sunlight Soap', description: '250g pack', quantity: 24 },
    { name: 'Lifebuoy Shampoo', description: '100ml bottle', quantity: 12 },
    { name: 'Anchor Milk Powder', description: '1kg pack', quantity: 8 },
    { name: 'Milo Drink', description: '200ml can', quantity: 15 },
  ];
}
