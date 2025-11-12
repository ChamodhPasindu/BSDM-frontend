import { Component, OnInit, ViewChild } from '@angular/core';
import { ViewItemComponent } from './view-item/view-item.component';
import { ViewBatchComponent } from './view-batch/view-batch.component';
import { alertWarning } from 'src/app/utility/helper';

@Component({
  selector: 'app-item-batch',
  templateUrl: './item-batch.component.html',
  styleUrls: ['./item-batch.component.scss'],
})
export class ItemBatchComponent implements OnInit {
  @ViewChild('itemModal') protected itemModal!: ViewItemComponent;
  @ViewChild('batchModal') protected batchModal!: ViewBatchComponent;

  constructor() {}

  protected items: any[] = [];
  protected batches: any[] = [];
  protected pagedItems: any[] = [];
  protected pagedBatches: any[] = [];

  protected currentItemPage = 1;
  protected currentBatchPage = 1;
  protected itemPageSize = 5;
  protected batchPageSize = 5;

  ngOnInit(): void {
    // sample data
    this.items = Array.from({ length: 35 }, (_, i) => ({
      name: `User ${i + 1}`,
      nic: `NIC${1000 + i}`,
    }));

    this.batches = Array.from({ length: 35 }, (_, i) => ({
      name: `User ${i + 1}`,
      nic: `NIC${1000 + i}`,
    }));

    this.updatePagedItems();
    this.updatePagedBatches();
  }

  protected goToItemPage(page: number): void {
    this.currentItemPage = page;
    this.updatePagedItems();
  }

  protected goToBatchPage(page: number): void {
    this.currentBatchPage = page;
    this.updatePagedBatches();
  }

  protected onItemPageSizeChange(newSize: number): void {
    this.itemPageSize = newSize;
    this.currentItemPage = 1;
    this.updatePagedItems();
  }

  protected onBatchPageSizeChange(newSize: number): void {
    this.batchPageSize = newSize;
    this.currentBatchPage = 1;
    this.updatePagedBatches();
  }

  protected updatePagedItems(): void {
    const start = (this.currentItemPage - 1) * this.itemPageSize;
    const end = start + this.itemPageSize;
    this.pagedItems = this.items.slice(start, end);
  }

  protected updatePagedBatches(): void {
    const start = (this.currentBatchPage - 1) * this.batchPageSize;
    const end = start + this.batchPageSize;
    this.pagedBatches = this.batches.slice(start, end);
  }

  protected openItemView(item?: any) {
    this.itemModal.item = item;
    this.itemModal.visible = true;
  }

  protected openBatchView(batch?: any) {
    this.batchModal.batch = batch;
    this.batchModal.visible = true;
  }

  protected deleteItem() {
    alertWarning({
      title: 'Confirm Delete',
      text: 'message',
    });
  }

  protected deleteBatch() {
    alertWarning({
      title: 'Confirm Delete',
      text: 'message',
    });
  }
}
