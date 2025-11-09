import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss'],
})
export class RouteComponent implements OnInit {
  ngOnInit(): void {}
  routes = [
    {
      name: 'Route 1 - Colombo North',
      expanded: false,
      customers: [
        { name: 'Amal Stores', shop: 'Colombo 01', visited: true },
        { name: 'Super Mart', shop: 'Colombo 02', visited: false },
      ],
    },
    {
      name: 'Route 2 - Gampaha Area',
      expanded: false,
      customers: [
        { name: 'New Lanka Traders', shop: 'Gampaha', visited: true },
        { name: 'Mega Mart', shop: 'Kadawatha', visited: false },
        { name: 'City Food', shop: 'Kelaniya', visited: false },
      ],
    },
    {
      name: 'Route 2 - Gampaha Area',
      expanded: false,
      customers: [
        { name: 'New Lanka Traders', shop: 'Gampaha', visited: true },
        { name: 'Mega Mart', shop: 'Kadawatha', visited: false },
        { name: 'City Food', shop: 'Kelaniya', visited: false },
      ],
    },
    {
      name: 'Route 2 - Gampaha Area',
      expanded: false,
      customers: [
        { name: 'New Lanka Traders', shop: 'Gampaha', visited: true },
        { name: 'Mega Mart', shop: 'Kadawatha', visited: false },
        { name: 'City Food', shop: 'Kelaniya', visited: false },
      ],
    },
    {
      name: 'Route 2 - Gampaha Area',
      expanded: false,
      customers: [
        { name: 'New Lanka Traders', shop: 'Gampaha', visited: true },
        { name: 'Mega Mart', shop: 'Kadawatha', visited: false },
        { name: 'City Food', shop: 'Kelaniya', visited: false },
      ],
    },
  ];

  toggleRoute(index: number): void {
    this.routes[index].expanded = !this.routes[index].expanded;
  }

  getVisitedCount(customers: any[]): number {
    return customers.filter((c) => c.visited).length;
  }
}
