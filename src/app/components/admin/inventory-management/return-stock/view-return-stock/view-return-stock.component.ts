import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-return-stock',
  templateUrl: './view-return-stock.component.html',
  styleUrls: ['./view-return-stock.component.scss']
})
export class ViewReturnStockComponent implements OnInit {
  ngOnInit(): void {
  }
  @Input() returnStock: any;

  visible = false;

  assignedStocks = [
    {
      id: 1,
      date: '2025-11-01',
      driver: { id: 1, name: 'John Doe' },
      vehicle: { id: 1, number: 'KA-4567' },
      route: { id: 1, name: 'Colombo North' },
      products: [
        { id: 1, name: 'Cement Bag', category: 'Building', assignedQty: 50 },
        { id: 2, name: 'Steel Rod', category: 'Hardware', assignedQty: 30 },
      ],
    },
    {
      id: 2,
      date: '2025-11-02',
      driver: { id: 2, name: 'Mark Silva' },
      vehicle: { id: 2, number: 'BA-2345' },
      route: { id: 2, name: 'Galle Route' },
      products: [
        { id: 3, name: 'Bricks', category: 'Building', assignedQty: 100 },
      ],
    },
  ];

  selectedAssign: any = null;
  selectedProduct: any = null;
  returnQuantity: number | null = null;

  returnList: any[] = [];

  // Modal controls
  changeModalVisibility(event: boolean) {
    this.visible = event;
  }

  closeModal() {
    this.visible = false;
  }

  onAssignChange() {
    this.selectedProduct = null;
    this.returnQuantity = null;
    this.returnList = [];
  }

  selectProduct(product: any) {
    this.selectedProduct = product;
    this.returnQuantity = null;
  }

  addReturn() {
    const existing = this.returnList.find((r) => r.id === this.selectedProduct.id);
    if (existing) {
      existing.returnQty = this.returnQuantity;
    } else {
      this.returnList.push({
        ...this.selectedProduct,
        returnQty: this.returnQuantity,
      });
    }
    this.selectedProduct = null;
    this.returnQuantity = null;
  }

  removeReturn(index: number) {
    this.returnList.splice(index, 1);
  }

  confirmReturn() {
    alert('Return stock successfully recorded!');
  }
}
