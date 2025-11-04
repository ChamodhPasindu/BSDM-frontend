import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-sale-stock',
  templateUrl: './view-sale-stock.component.html',
  styleUrls: ['./view-sale-stock.component.scss']
})
export class ViewSaleStockComponent implements OnInit {
  assignDate: string = new Date().toISOString().split('T')[0];
  searchText = '';

  drivers = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Mark Silva' },
  ];
  vehicles = [
    { id: 1, number: 'KA-4567' },
    { id: 2, number: 'BA-2345' },
  ];
  routes = [
    { id: 1, name: 'Colombo North' },
    { id: 2, name: 'Galle Route' },
  ];

  selectedDriver: any;
  selectedVehicle: any;
  selectedRoute: any;

  products = [
    { id: 1, name: 'Cement Bag', category: 'Building', stock: 200 },
    { id: 2, name: 'Steel Rod', category: 'Hardware', stock: 120 },
  ];
  filteredProducts = [...this.products];

  selectedProduct: any;
  selectedQuantity: any;
  cartItems: any[] = [];

  constructor() {}

  ngOnInit() {}

  @Input() saleStock: any;
  public visible = false;

  protected closeModal(): void {
    this.visible = !this.visible;
  }

  protected changeModalVisibility(event: boolean): void {
    this.visible = event;
  }

  getDriverName(id: number) {
    return this.drivers.find(d => d.id === id)?.name;
  }
  getVehicleName(id: number) {
    return this.vehicles.find(v => v.id === id)?.number;
  }
  getRouteName(id: number) {
    return this.routes.find(r => r.id === id)?.name;
  }

  onDriverChange() {}
  onVehicleChange() {}
  onRouteChange() {}

  // 🔹 Product filtering and selection
  filterProducts() {
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  selectProduct(product: any) {
    this.selectedProduct = product;
    this.selectedQuantity = null;
  }

  addToCart() {
    this.cartItems.push({
      ...this.selectedProduct,
      quantity: this.selectedQuantity,
    });
    this.selectedProduct = null;
    this.selectedQuantity = null;
  }

  removeFromCart(index: number) {
    this.cartItems.splice(index, 1);
  }

  confirmAssign() {
    alert('Stock assignment confirmed!');
  }

}
