import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertViewComponent } from './alert-view/alert-view.component';

@Component({
  selector: 'app-alert-management',
  templateUrl: './alert-management.component.html',
  styleUrls: ['./alert-management.component.scss'],
})
export class AlertManagementComponent implements OnInit {
  constructor(private readonly modal: NgbModal) {}

  ngOnInit() {}

  protected openAlertView() {
    this.modal.open(AlertViewComponent, {
      size: 'lg',
      centered: true,
      windowClass: 'modal-medium my-large-modal',
    });
  }
}
