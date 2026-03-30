import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserRole } from 'src/app/enums/UserRole.enum';
import { IEmployeeData } from 'src/app/interfaces/IEmployeeData';
import { INotification } from 'src/app/interfaces/INotification';
import { IResponse } from 'src/app/interfaces/IResponse';
import { AlertService } from 'src/app/services/alert/alert.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import { ModalControlDirective } from 'src/app/utility/directives/modal-control.directive';
import {
  alertError,
  alertSuccess,
  errorMessageHandler,
  onValidate,
} from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-alert-view',
  templateUrl: './alert-view.component.html',
  styleUrls: ['./alert-view.component.scss'],
})
export class AlertViewComponent
  extends ModalControlDirective
  implements OnInit
{
  protected employeeList: IEmployeeData[];
  protected readonly alertTypeList: Record<string, string>[] = [
    { code: 'LOW', description: 'Low' },
    { code: 'MEDIUM', description: 'Medium' },
    { code: 'HIGH', description: 'High' },
  ];

  protected alertForm: FormGroup;

  constructor(
    private readonly alertService: AlertService,
    private readonly employeeService: EmployeeService,
    private readonly fb: FormBuilder,
  ) {
    super();
    this.createForm();
  }

  ngOnInit(): void {}

  protected override resetState(): void {}

  private createForm(): void {
    this.alertForm = this.fb.group({
      recipientUserId: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      message: ['', [Validators.required]],
      title: ['', [Validators.required]],
    });
    this.setForm(this.alertForm);
  }

  public loadData(): void {
    this.loadEmployeeListData();
  }

  private loadEmployeeListData(): void {
    this.employeeService
      .getEmployeeList({ pageable: false })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.employeeList =
              res.body.content.filter(
                (x: IEmployeeData) => x.roleCode === UserRole.SALESMAN,
              ) || [];
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

  protected onSubmit(): void {
    if (!onValidate(this.alertForm)) return;

    this.alertService
      .addNotification(this.alertForm.value)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.tableRefresh.emit();
            this.onCloseModal();
            alertSuccess({
              title: RESPONSE_TITLES.SUCCESS,
              text:
                res.body.message || RESPONSE_MESSAGES.NOTIFICATION_SEND_SUCCESS,
            });
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message || RESPONSE_MESSAGES.NOTIFICATION_SEND_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
        },
      });
  }
}
