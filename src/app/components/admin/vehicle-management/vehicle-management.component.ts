import { Component, OnInit, ViewChild } from '@angular/core';
import { ViewVehicleComponent } from './view-vehicle/view-vehicle.component';
import { alertWarning } from 'src/app/utility/helper';

@Component({
  selector: 'app-vehicle-management',
  templateUrl: './vehicle-management.component.html',
  styleUrls: ['./vehicle-management.component.scss'],
})
export class VehicleManagementComponent implements OnInit {
  @ViewChild('vehicleModal') protected vehicleModal!: ViewVehicleComponent;

  protected delete() {
    alertWarning({
      title: 'Confirm Delete',
      text: 'message',
    });
  }

  protected users: any[] = [];
  protected pagedUsers: any[] = [];

  protected currentPage = 1;
  protected pageSize = 5;

  ngOnInit(): void {
    // sample data
    this.users = Array.from({ length: 35 }, (_, i) => ({
      name: `User ${i + 1}`,
      nic: `NIC${1000 + i}`,
    }));

    this.updatePagedUsers();
  }

  protected goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagedUsers();
  }

  protected onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.updatePagedUsers();
  }

  protected updatePagedUsers(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedUsers = this.users.slice(start, end);
  }

  protected openVehicleView(vehicle?: any) {
    this.vehicleModal.vehicle = vehicle;
    this.vehicleModal.visible = true;
  }
}
