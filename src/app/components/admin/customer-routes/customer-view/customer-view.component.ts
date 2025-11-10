import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss']
})
export class CustomerViewComponent implements OnInit {
  routes = [
    { id: 1, name: 'Colombo Route', description: 'Downtown and suburbs deliveries' },
    { id: 2, name: 'Kandy Route', description: 'Central province distribution' },
  ];

  selectedRoute: any = null;

  customers = [
    { name: '', phone: '', shopName: '', address: '' }
  ];

  constructor() {}

  ngOnInit() {}

  @Input() customer: any;
  public visible = false;

  protected closeModal(): void {
    this.visible = !this.visible;
  }

  protected changeModalVisibility(event: boolean): void {
    this.visible = event;
  }
 
  addCustomerForm() {
    this.customers.push({ name: '', phone: '', shopName: '', address: '' });
  }

  removeCustomer(index: number) {
    this.customers.splice(index, 1);
  }

  saveCustomers() {
    if (!this.selectedRoute) {
      alert('Please select a route first!');
      return;
    }
    console.log('Route:', this.selectedRoute);
    console.log('Customers:', this.customers);
    this.closeModal();
  }


}
