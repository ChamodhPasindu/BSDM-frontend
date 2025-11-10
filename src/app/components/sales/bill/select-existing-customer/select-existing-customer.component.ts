import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-select-existing-customer',
  templateUrl: './select-existing-customer.component.html',
  styleUrls: ['./select-existing-customer.component.scss'],
})
export class SelectExistingCustomerComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {}

  // Step 2: Customers
  customers = [
    { id: 1, name: 'John Doe', shopName: 'JD Shop', address: 'Main Street' },
    { id: 2, name: 'Jane Smith', shopName: 'Smith Mart', address: 'North Ave' },
    {
      id: 3,
      name: 'Alice Brown',
      shopName: 'Alice Store',
      address: 'East Road',
    },
  ];
  filteredCustomers = [...this.customers];
  selectedCustomer: any = null;
  customerSearchTerm: string = '';

  filterCustomers() {
    const term = this.customerSearchTerm.toLowerCase();
    this.filteredCustomers = this.customers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.shopName.toLowerCase().includes(term) ||
        c.address.toLowerCase().includes(term)
    );
  }

  navigateNext() {
    this.router.navigate(['../select-product'], { relativeTo: this.route });
  }
}
