import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-stock',
  templateUrl: './view-stock.component.html',
  styleUrls: ['./view-stock.component.scss'],
})
export class ViewStockComponent implements OnInit{
  ngOnInit(): void {
    this.setupPagination();
  }

  searchText = '';
  stockRemark = '';
  selectedProduct: any = null;
  selectedQuantity: number | null = null;
  selectedRemark: string = '';
  cartItems: any[] = [];

  products = [
    { id: 1, name: 'Product A', category: 'Electronics', stock: 50 },
    { id: 2, name: 'Product B', category: 'Furniture', stock: 30 },
    { id: 3, name: 'Product C', category: 'Stationery', stock: 100 },
    { id: 3, name: 'Product D', category: 'Stationery', stock: 100 },
    { id: 3, name: 'Product E', category: 'Stationery', stock: 100 },
    { id: 3, name: 'Product F', category: 'Stationery', stock: 100 },
  ];

  filteredProducts = [...this.products];

  pageSize = 5;
  currentPage = 1;
  totalPages = 0;
  paginatedProducts: any[] = [];

  filterProducts() {
    this.filteredProducts = this.products.filter((p) =>
      p.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.setupPagination();
  }

  setupPagination() {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    this.changePage(1);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  selectProduct(product: any) {
    this.selectedProduct = product;
    this.selectedQuantity = null;
    this.selectedRemark = '';
  }

  addToCart() {
    if (this.selectedProduct && this.selectedQuantity) {
      this.cartItems.push({
        ...this.selectedProduct,
        quantity: this.selectedQuantity,
        remark: this.selectedRemark,
      });

      // Clear selection
      this.selectedProduct = null;
      this.selectedQuantity = null;
      this.selectedRemark = '';
    }
  }

  removeFromCart(index: number) {
    this.cartItems.splice(index, 1);
  }

  addStock() {
    console.log('Stock Remark:', this.stockRemark);
    console.log('Cart Items:', this.cartItems);
    this.closeModal();
  }

  @Input() stock: any;
  public visible = false;

  protected closeModal(): void {
    this.visible = !this.visible;
  }

  protected changeModalVisibility(event: boolean): void {
    this.visible = event;
  }
}
