import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  products = [
    {
      name: 'Sunlight Soap',
      description: '250g pack',
      quantity: 24,
      minPrice: 75,
      price: 80
    },
    {
      name: 'Lifebuoy Shampoo',
      description: '100ml bottle',
      quantity: 4,
      minPrice: 120,
      price: 115
    },
    {
      name: 'Anchor Milk Powder',
      description: '1kg pack',
      quantity: 10,
      minPrice: 1200,
      price: 1250
    },
    {
      name: 'Milo Drink',
      description: '200ml can',
      quantity: 3,
      minPrice: 230,
      price: 230
    }
  ];
  
  constructor() { }

  ngOnInit() {
  }

}
