import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent implements OnInit {
  ngOnInit(): void {}

  currentStep = 1;

  // Step 1
  selectedRoute: string = '';

  // Step 2
  customerName: string = '';
  customerPhone: string = '';
  customerAddress: string = '';

  nextStep() {
    if (this.currentStep < 2) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  submitCustomer() {
    const customerData = {
      route: this.selectedRoute,
      name: this.customerName,
      phone: this.customerPhone,
      address: this.customerAddress,
    };
    console.log('Customer Submitted:', customerData);
    alert('Customer Added Successfully!');

    // Reset for new entry
    this.currentStep = 1;
    this.selectedRoute = '';
    this.customerName = '';
    this.customerPhone = '';
    this.customerAddress = '';
  }

  routes = [
    'Route A',
    'Route B',
    'Route C',
    'Route D',
    'Main Street',
    'North Line',
  ];
  filteredRoutes: string[] = [];
  routeSearchTerm: string = '';

  constructor() {
    this.filteredRoutes = [...this.routes];
  }

  filterRoutes() {
    const term = this.routeSearchTerm.toLowerCase();
    this.filteredRoutes = this.routes.filter((r) =>
      r.toLowerCase().includes(term)
    );
  }

  selectRoute(route: string) {
    this.selectedRoute = route;
  }
}
