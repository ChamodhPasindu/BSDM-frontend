import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewBatchComponent } from './view-batch/view-batch.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { ViewItemComponent } from './view-item/view-item.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  constructor(private readonly modal: NgbModal) {}

  ngOnInit() {}

  protected openBatchView() {
    this.modal.open(ViewBatchComponent, {
      size: 'lg',
      centered: true,
      windowClass: 'modal-medium my-large-modal',
    });
  }

  protected openProductView() {
    this.modal.open(ViewProductComponent, {
      size: 'lg',
      centered: true,
      windowClass: 'modal-medium my-large-modal',
    });
  }
  
  protected openItemView() {
    this.modal.open(ViewItemComponent, {
      size: 'lg',
      centered: true,
      windowClass: 'modal-medium my-large-modal',
    });
  }
}
