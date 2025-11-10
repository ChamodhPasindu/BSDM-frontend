import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
})
export class ViewProductComponent implements OnInit {
  ngOnInit() {}

  productForm: FormGroup;
  items = [
    { id: 1, name: 'Item A' },
    { id: 2, name: 'Item B' },
    { id: 3, name: 'Item C' },
  ];
  batches = [
    { id: 'B1', name: 'Batch 1' },
    { id: 'B2', name: 'Batch 2' },
  ];

  selectedItemDetails: any = null;
  selectedBatchDetails: any = null;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      item: [''],
      batch: [''],
      description: [''],
      quantity: [''],
      price: [''],
      minSalesPrice: [''],
    });
  }

  onItemChange(itemId: any) {
    // simulate fetching data for selected item
    this.selectedItemDetails = {
      category: 'Electronics',
      stock: 45,
      supplier: 'ABC Traders',
    };
  }

  onBatchChange(batchId: any) {
    this.selectedBatchDetails = {
      batchNo: 'Electronics',
      mfd: 45,
      exp: 'ABC Traders',
    };
  }

  @Input() product: any;
  public visible = false;

  protected closeModal(): void {
    this.visible = !this.visible;
  }

  protected changeModalVisibility(event: boolean): void {
    this.visible = event;
  }

  onSubmit() {
    console.log(this.productForm.value);
    this.closeModal();
  }
}
