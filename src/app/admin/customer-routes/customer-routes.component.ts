import { Component, OnInit } from '@angular/core';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { RouteViewComponent } from './route-view/route-view.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-customer-routes',
  templateUrl: './customer-routes.component.html',
  styleUrls: ['./customer-routes.component.scss'],
})
export class CustomerRoutesComponent implements OnInit {
  constructor(private readonly modal: NgbModal) {}

  ngOnInit() {}

  protected openRouteView() {
    this.modal.open(CustomerViewComponent, {
      size: 'lg',
      centered: true,
      windowClass: 'modal-medium my-large-modal',
    });
  }

  protected openCustomerView() {
    this.modal.open(RouteViewComponent, {
      size: 'lg',
      centered: true,
      windowClass: 'modal-medium my-large-modal',
    });
  }
}
