import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap } from 'rxjs';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { IEmployeeData } from 'src/app/interfaces/IEmployeeData';
import { IResponse } from 'src/app/interfaces/IResponse';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import {
  UserRoles,
  UserStatus,
} from 'src/app/utility/constants/other-constant';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  REGEX_EMAIL,
  REGEX_MOBILE,
  REGEX_NAME,
  REGEX_NIC,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from 'src/app/utility/constants/validation';
import { ModalControlDirective } from 'src/app/utility/directives/modal-control.directive';
import {
  alertError,
  alertSuccess,
  errorMessageHandler,
  onValidate,
  passwordMatchValidator,
} from 'src/app/utility/helper';

@UntilDestroy()
@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.scss'],
})
export class EmployeeViewComponent extends ModalControlDirective {
  protected readonly ActionButton = ActionButton;

  private _employee: IEmployeeData | undefined;
  private _action: ActionButton;

  protected showPassword: boolean = false;
  protected showConfirmPassword: boolean = false;

  protected employeeForm: FormGroup;
  protected previewUrl: string | ArrayBuffer | null = null;
  protected selectedFile: File | null = null;

  protected roleList: Record<string, string>[] = UserRoles;
  protected statusList: Record<string, string>[] = UserStatus;

  @Input()
  public set employee(value: IEmployeeData | undefined) {
    this._employee = value;
    this.updateForm();
  }

  public get employee() {
    return this._employee;
  }

  @Input()
  public set action(value: ActionButton) {
    this._action = value;
    this.updateForm();
  }

  public get action() {
    return this._action;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly employeeService: EmployeeService
  ) {
    super();
    this.createForm();
  }

  protected createForm(): void {
    this.employeeForm = this.fb.group(
      {
        profileImage: [''],
        name: ['', [Validators.required, Validators.pattern(REGEX_NAME)]],
        nic: ['', [Validators.required, Validators.pattern(REGEX_NIC)]],
        email: ['', [Validators.required, Validators.pattern(REGEX_EMAIL)]],
        role: ['', Validators.required],
        status: ['', Validators.required],
        mobileNumber: [
          '',
          [Validators.required, Validators.pattern(REGEX_MOBILE)],
        ],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(USERNAME_MIN_LENGTH),
            Validators.maxLength(USERNAME_MAX_LENGTH),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(PASSWORD_MIN_LENGTH),
            Validators.maxLength(PASSWORD_MAX_LENGTH),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: passwordMatchValidator,
      }
    );
    this.setForm(this.employeeForm);
  }

  private updateForm(): void {
    if (!this.action) return;

    this.previewUrl = null;
    this.selectedFile = null;

    if (this.action === ActionButton.VIEW) {
      this.patchValue();
      this.employeeForm.disable();
    }

    if (this.action === ActionButton.EDIT) {
      this.patchValue();
      this.employeeForm.enable();
    }

    if (this.action === ActionButton.ADD) {
      this.employeeForm.enable();
    }
  }

  private patchValue(): void {
    this.employeeForm.patchValue({
      profileImage: this.employee?.profileImageBase64 || '',
      name: this.employee?.name,
      nic: this.employee?.nic,
      email: this.employee?.email,
      role: this.employee?.roleCode,
      status: this.employee?.statusCode,
      mobileNumber: this.employee?.mobileNumber,
      username: this.employee?.username,

      password: '',
      confirmPassword: '',
    });
  }

  protected onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = reader.result;
        this.employeeForm.patchValue({
          profileImage: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else {
      this.previewUrl = null;
    }
  }

  protected onSubmit(): void {
    if (!onValidate(this.employeeForm)) return;

    const { nic, username } = this.employeeForm.value;

    this.employeeService
      .validateNIC(nic)
      .pipe(
        untilDestroyed(this),
        switchMap((nicRes: IResponse) => {
          if (
            nicRes.body.status !== RSP_SUCCESS ||
            !nicRes.body.content.isAvailable
          ) {
            throw nicRes;
          }
          return this.employeeService.validateUsername(username);
        }),
        switchMap((userRes: IResponse) => {
          if (
            userRes.body.status !== RSP_SUCCESS ||
            !userRes.body.content.isAvailable
          ) {
            throw userRes;
          }
          return this.employeeService.createEmployee(this.employeeForm.value);
        })
      )
      .subscribe({
        next: (createRes: IResponse) => {
          if (createRes.body.status === RSP_SUCCESS) {
            this.tableRefresh.emit();
            this.onCloseModal();
            alertSuccess({
              title: RESPONSE_TITLES.SUCCESS,
              text:
                createRes.body.message ||
                RESPONSE_MESSAGES.EMPLOYEE_ADD_EDIT_SUCCESS,
            });
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                createRes.body.message ||
                RESPONSE_MESSAGES.EMPLOYEE_ADD_EDIT_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse | IResponse) => {
          if (err instanceof HttpErrorResponse) {
            errorMessageHandler(err);
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                err.body?.content?.message ||
                RESPONSE_MESSAGES.EMPLOYEE_ADD_EDIT_FAILED,
            });
          }
        },
      });
  }
}
