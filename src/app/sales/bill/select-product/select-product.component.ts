import { Component, OnInit } from '@angular/core';
import { NgxBottomSheetService } from 'ngx-bottom-sheet';
import { BillSummaryComponent } from '../bill-summary/bill-summary.component';

@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.component.html',
  styleUrls: ['./select-product.component.scss'],
})
export class SelectProductComponent implements OnInit {
  constructor(private bottomSheetService: NgxBottomSheetService) {}

  ngOnInit() {}

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
