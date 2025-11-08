import { Component, OnInit } from '@angular/core';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { BillSummaryComponent } from '../bill-summary/bill-summary.component';

@Component({
  selector: 'app-existing',
  templateUrl: './existing.component.html',
  styleUrls: ['./existing.component.scss'],
})
export class ExistingComponent implements OnInit {
  currentStep = 1;

  // Step 1
  selectedRoute: string = '';

  // Step 2
  customerName: string = '';
  customerPhone: string = '';
  customerAddress: string = '';

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

  nextStep() {
    if (this.currentStep < 3) this.currentStep++;
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

  constructor(
    private bottomSheetService: NgxBottomSheetService
  ) {
    this.filteredRoutes = [...this.routes];

  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
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

  // Customer search
  filterCustomers() {
    const term = this.customerSearchTerm.toLowerCase();
    this.filteredCustomers = this.customers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.shopName.toLowerCase().includes(term) ||
        c.address.toLowerCase().includes(term)
    );
  }

  selectCustomer(customer: any) {
    this.selectedCustomer = customer;
    this.currentStep = 3; // navigate to products step
  }

  products = [
    {
      id: 1,
      name: 'Product A',
      description: 'High-quality item',
      minPrice: 100,
      maxPrice: 150,
      qty: 0,
      selected: false,
    },
    {
      id: 2,
      name: 'Product B',
      description: 'Durable and reliable',
      minPrice: 200,
      maxPrice: 250,
      qty: 0,
      selected: false,
    },
    {
      id: 3,
      name: 'Product C',
      description: 'Best seller',
      minPrice: 150,
      maxPrice: 180,
      qty: 0,
      selected: false,
    },
  ];

  filteredProducts = [...this.products];
  productSearchTerm: string = '';

  filterProducts() {
    const term = this.productSearchTerm.toLowerCase();
    this.filteredProducts = this.products.filter((p) =>
      p.name.toLowerCase().includes(term)
    );
  }

  // Increase quantity
  increaseQty(product: any) {
    product.qty += 1;
    if (!product.selected) product.selected = true;
  }

  // Decrease quantity
  decreaseQty(product: any) {
    if (product.qty > 0) product.qty -= 1;
    if (product.qty === 0) product.selected = false;
  }

  // Check if any product is selected
  hasSelectedProducts(): boolean {
    return this.products.some((p) => p.selected && p.qty > 0);
  }

  // Confirm Order
  confirmOrder() {
    const selectedProducts = this.products.filter(
      (p) => p.selected && p.qty > 0
    );
    console.log('Order Confirmed:', selectedProducts);
    alert('Order Confirmed!');
    // Reset products
    this.products.forEach((p) => {
      p.qty = 0;
      p.selected = false;
    });
  }

  getTotalAmount(): number {
    return this.filteredProducts
      .filter((p) => p.selected)
      .reduce((sum, p) => sum + (p.qty * p.maxPrice || 0), 0);
  }

  getSelectedCount(): number {
    return this.filteredProducts.filter((p) => p.selected && p.qty > 0).length;
  }

  toggleBottomSheet() {
    this.bottomSheetService.open(BillSummaryComponent, {
      height: 'top',
      showCloseButton: true,
      backgroundColor: '#fff',
    });
  }
}
