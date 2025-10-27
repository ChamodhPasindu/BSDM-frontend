import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeViewComponent } from './employee-view/employee-view.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss'],
})
export class EmployeeManagementComponent implements OnInit {
  constructor(private readonly modal: NgbModal) {}
  ngOnInit() {}

  protected openEmployeeView() {
    this.modal.open(EmployeeViewComponent, {
      size: 'lg',
      centered: true,
      windowClass: 'modal-medium my-large-modal',
    });
  }
}
