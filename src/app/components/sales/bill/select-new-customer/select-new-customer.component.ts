import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-select-new-customer',
  templateUrl: './select-new-customer.component.html',
  styleUrls: ['./select-new-customer.component.scss']
})
export class SelectNewCustomerComponent implements OnInit {

  constructor(private router:Router,private route:ActivatedRoute) { }

  ngOnInit() {
  }

  customerName: string = '';
  customerPhone: string = '';
  customerAddress: string = '';

  submitCustomer() {
    const customerData = {
      name: this.customerName,
      phone: this.customerPhone,
      address: this.customerAddress,
    };
    console.log('Customer Submitted:', customerData);
    alert('Customer Added Successfully!');

    // Reset for new entry
    this.customerName = '';
    this.customerPhone = '';
    this.customerAddress = '';
  }

  navigateNext() {
    this.router.navigate(['../select-product'], {relativeTo:this.route});
  }

}
