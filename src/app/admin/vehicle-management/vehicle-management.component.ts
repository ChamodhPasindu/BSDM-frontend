import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewVehicleComponent } from './view-vehicle/view-vehicle.component';

@Component({
  selector: 'app-vehicle-management',
  templateUrl: './vehicle-management.component.html',
  styleUrls: ['./vehicle-management.component.scss'],
})
export class VehicleManagementComponent implements OnInit {
  constructor(private readonly modal: NgbModal) {}

  ngOnInit() {}

  protected openVehicleView() {
    this.modal.open(ViewVehicleComponent, {
      size: 'lg',
      centered: true,
      windowClass: 'modal-medium my-large-modal',
    });
  }
}
