import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, forkJoin, switchMap } from 'rxjs';
import { ActionButton } from 'src/app/enums/ActionButton.enum';
import { CommonCode } from 'src/app/enums/CommonCode.enum';
import { IEmployee } from 'src/app/interfaces/IEmployee';
import { IEmployeeData } from 'src/app/interfaces/IEmployeeData';
import { IResponse } from 'src/app/interfaces/IResponse';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { GeneralService } from 'src/app/services/general/general.service';
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
export class EmployeeViewComponent
  extends ModalControlDirective
  implements OnInit
{
  protected readonly ActionButton = ActionButton;

  private _employee: IEmployeeData | undefined;
  private _action: ActionButton;

  protected showPassword: boolean = false;
  protected showConfirmPassword: boolean = false;

  protected employeeForm: FormGroup;
  protected previewUrl: string | ArrayBuffer | null = null;
  protected selectedFile: File | null = null;

  protected roleList: Record<string, string>[];
  protected statusList: Record<string, string | number>[];

  protected enablePasswordUpdate: boolean = true;

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
  }

  public get action() {
    return this._action;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly employeeService: EmployeeService,
    private readonly generalService: GeneralService
  ) {
    super();
    this.createForm();
  }

  ngOnInit(): void {
  }

  public loadData(): void {
    forkJoin({
      roles: this.generalService.getDropDownList(CommonCode.USER_ROLES),
      status: this.generalService.getStatusList(CommonCode.USER_STATUS),
    })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: { roles: IResponse; status: IResponse }) => {
          if (res.roles.body.status === RSP_SUCCESS) {
            this.roleList = res.roles.body.content.dropdown;
          }

          if (res.status.body.status === RSP_SUCCESS) {
            this.statusList = res.status.body.content.dropdown;
          }

          if (
            res.status.body.status !== RSP_SUCCESS ||
            res.roles.body.status !== RSP_SUCCESS
          ) {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.roles.body.message || RESPONSE_MESSAGES.COMMON_ERROR_DES,
            });
          }
        },
        error: (err: HttpErrorResponse) => errorMessageHandler(err),
      });
  }

  private createForm(): void {
    this.employeeForm = this.fb.group(
      {
        profileImage: [''],
        name: ['', [Validators.required, Validators.pattern(REGEX_NAME)]],
        nic: ['', [Validators.required, Validators.pattern(REGEX_NIC)]],
        email: ['', [Validators.required, Validators.pattern(REGEX_EMAIL)]],
        role: [null, Validators.required],
        status: [null, Validators.required],
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
      this.enablePasswordUpdate = false;
    }

    if (this.action === ActionButton.EDIT) {
      this.patchValue();
      this.employeeForm.enable();
      this.enablePasswordUpdate = false;
      this.onTogglePasswordUpdate();
    }

    if (this.action === ActionButton.ADD) {
      this.employeeForm.enable();
      this.enablePasswordUpdate = true;
    }
  }

  private patchValue(): void {
    this.employeeForm.patchValue({
      profileImage: '',
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

    this.previewUrl = this.employee?.profileImageBase64 || null;
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

  protected onTogglePasswordUpdate(): void {
    const username = this.employeeForm.get('username');
    const pass = this.employeeForm.get('password');
    const confirm = this.employeeForm.get('confirmPassword');

    if (this.enablePasswordUpdate) {
      username?.addValidators([
        Validators.required,
        Validators.minLength(USERNAME_MIN_LENGTH),
        Validators.maxLength(USERNAME_MAX_LENGTH),
      ]);
      pass?.addValidators([
        Validators.required,
        Validators.minLength(PASSWORD_MIN_LENGTH),
        Validators.maxLength(PASSWORD_MAX_LENGTH),
      ]);
      confirm?.addValidators([Validators.required]);
    } else {
      username?.clearValidators();
      pass?.clearValidators();
      confirm?.clearValidators();

      pass?.setValue(null);
      confirm?.setValue(null);
    }

    username?.updateValueAndValidity();
    pass?.updateValueAndValidity();
    confirm?.updateValueAndValidity();
  }

  protected onSubmit(): void {
    if (!onValidate(this.employeeForm)) return;

    const { username } = this.employeeForm?.value;
    if (this.action === ActionButton.ADD) {
      this.addEmployee(this.employeeForm.value);
    } else {
      this.updateEmployee(
        {
          ...this.employeeForm?.value,
          profileImage: this.previewUrl,
          userId: this.employee?.userId,
        },
        username !== this.employee?.username
      );
    }
  }

  private addEmployee(data: IEmployee): void {
    this.employeeService
      .validateNIC(data.nic)
      .pipe(
        untilDestroyed(this),
        switchMap((nicRes: IResponse) => {
          if (
            nicRes.body.status !== RSP_SUCCESS ||
            !nicRes.body.content.isAvailable
          ) {
            throw nicRes;
          }
          return this.employeeService.validateUsername(data.username);
        }),
        switchMap((userRes: IResponse) => {
          if (
            userRes.body.status !== RSP_SUCCESS ||
            !userRes.body.content.isAvailable
          ) {
            throw userRes;
          }
          return this.employeeService.createEmployee(data);
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

  private updateEmployee(data: IEmployee, isUsernameUpdate: boolean): void {
    console.log(data);

    let updatePipeline$: Observable<IResponse>;

    if (isUsernameUpdate) {
      updatePipeline$ = this.employeeService
        .validateUsername(data.username)
        .pipe(
          switchMap((userRes: IResponse) => {
            if (
              userRes.body.status !== RSP_SUCCESS ||
              !userRes.body.content.isAvailable
            ) {
              throw userRes; // username unavailable
            }
            return this.employeeService.updateEmployee(data);
          })
        );
    } else {
      updatePipeline$ = this.employeeService.updateEmployee(data);
    }

    updatePipeline$.pipe(untilDestroyed(this)).subscribe({
      next: (updateRes: IResponse) => {
        if (updateRes.body.status === RSP_SUCCESS) {
          this.tableRefresh.emit();
          this.onCloseModal();

          alertSuccess({
            title: RESPONSE_TITLES.SUCCESS,
            text:
              updateRes.body.message ||
              RESPONSE_MESSAGES.EMPLOYEE_ADD_EDIT_SUCCESS,
          });
        } else {
          alertError({
            title: RESPONSE_TITLES.FAILED,
            text:
              updateRes.body.message ||
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
