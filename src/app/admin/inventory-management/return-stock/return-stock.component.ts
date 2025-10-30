import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-return-stock',
  templateUrl: './return-stock.component.html',
  styleUrls: ['./return-stock.component.scss'],
})
export class ReturnStockComponent implements OnInit {
  @ViewChild('qtyChangeModal') qtyChangeModal: ElementRef | undefined;

  constructor(private readonly modal: NgbModal) {}

  ngOnInit() {}

  protected openQtyChangeModal() {
    this.modal.open(this.qtyChangeModal, {
      size: 'md',
      centered: true,
      windowClass: 'modal-medium',
    });
  }
}
