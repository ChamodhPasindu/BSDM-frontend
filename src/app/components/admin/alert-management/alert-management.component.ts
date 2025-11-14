import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertViewComponent } from './alert-view/alert-view.component';
import { alertWarning, datePickerToDate } from 'src/app/utility/helper';
import { PaginationType } from 'src/app/enums/PaginationType.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-alert-management',
  templateUrl: './alert-management.component.html',
  styleUrls: ['./alert-management.component.scss'],
})
export class AlertManagementComponent implements OnInit {
  @ViewChild('alertModal') protected alertModal!: AlertViewComponent;

  protected searchForm: FormGroup;

  //temporary alert types
  alertType = [
    {
      id: '1',
      name: 'Info',
    },
    {
      id: '2',
      name: 'Warning',
    },
    {
      id: '3',
      name: 'Critical',
    },
  ];

  constructor(private readonly fb: FormBuilder) {
    this.createForm();
  }

  protected createForm(): void {
    this.searchForm = this.fb.group({
      content: [''],
      type: [null],
      fromDate: [''],
      toDate: [''],
    });
  }

  protected onSubmit(): void {
    const { fromDate, toDate } = this.searchForm.value;
    console.log(this.searchForm.value, datePickerToDate(fromDate));
  }

  protected onExport(): void {}

  protected openAlertView(alert?: any): void {
    this.alertModal.alert = alert;
    this.alertModal.visible = true;
  }

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

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    // sample data
    this.users = Array.from({ length: 35 }, (_, i) => ({
      name: `User ${i + 1}`,
      nic: `NIC${1000 + i}`,
      license: `LKR ${12500 + i * 100}`,
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

  protected sortBy(column: string): void {
    if (this.sortColumn === column) {
      // toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.users.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA == null || valueB == null) return 0;

      return this.sortDirection === 'asc'
        ? valueA.toString().localeCompare(valueB.toString())
        : valueB.toString().localeCompare(valueA.toString());
    });

    this.updatePagedUsers();
  }

  protected updatePagedUsers(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedUsers = this.users.slice(start, end);
  }
}
