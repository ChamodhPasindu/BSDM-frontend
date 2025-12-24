import { Component, OnInit, ViewChild } from '@angular/core';
import {
  alertError,
  alertWarning,
  datePickerToDate,
  errorMessageHandler,
} from 'src/app/utility/helper';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from 'src/app/interfaces/IResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IPagination } from 'src/app/interfaces/IPagination';
import { IEmployeeData } from 'src/app/interfaces/IEmployeeData';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { AddEditViewEmployeeComponent } from './add-edit-view-employee/add-edit-view-employee.component';

@UntilDestroy()
@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.scss'],
})
export class EmployeeManagementComponent implements OnInit {
  @ViewChild('addEditViewEmployeeModal') protected addEditViewEmployeeModal!: AddEditViewEmployeeComponent;

  protected readonly ActionButton = ActionButton;
  protected employeeList: IEmployeeData[];

  protected currentPage: number = 1;
  protected pageSize: number = 5;
  protected count: number = 0;

  protected searchForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly employeeService: EmployeeService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadEmployeeTableData();
  }

  private createForm(): void {
    this.searchForm = this.fb.group({
      inputValue: [''],
      fromDate: [''],
      toDate: [''],
    });
  }

  protected onSubmit(): void {
    this.loadEmployeeTableData();
  }

  protected onRefresh(): void {
    this.loadEmployeeTableData();
  }

  private loadEmployeeTableData(): void {
    const { inputValue, fromDate, toDate } = this.searchForm.value;

    let formattedFromDate = null;
    let formattedToDate = null;
    if (fromDate) {
      formattedFromDate = datePickerToDate(fromDate);
    }

    if (toDate) {
      formattedToDate = datePickerToDate(toDate);
    }

    const paginationRequest: IPagination = {
      pageable: true,
      page: this.currentPage - 1,
      size: this.pageSize,
    };

    this.employeeService
      .getEmployeeList(
        paginationRequest,
        inputValue || '',
        formattedFromDate,
        formattedToDate
      )
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.employeeList = res.body.content.content || [];
            this.count = res.body.content.totalElements || 0;
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text: res.body.message || RESPONSE_MESSAGES.EMPLOYEE_GET_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }

  protected goToPage(page: number): void {
    this.currentPage = page;
    this.loadEmployeeTableData();
  }

  protected onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadEmployeeTableData();
  }

  protected openAddEditViewEmployeeModal(
    action: ActionButton,
    employee?: IEmployeeData
  ): void {
    this.addEditViewEmployeeModal.loadData();
    this.addEditViewEmployeeModal.action = action;
    this.addEditViewEmployeeModal.employee = employee;
    this.addEditViewEmployeeModal.visible = true;
  }

  protected onClear(): void {
    this.searchForm.reset();
    this.loadEmployeeTableData();
  }

  protected hasAnyValue(): boolean {
    const { inputValue, fromDate, toDate } = this.searchForm.value;

    return !!(inputValue || fromDate || toDate);
  }

  protected onDeleteEmployee(id: number): void {
    alertWarning({
      title: 'Confirm Delete',
      text: 'message',
    });
  }
}
