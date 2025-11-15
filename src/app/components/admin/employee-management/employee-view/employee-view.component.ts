import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap } from 'rxjs';
import { IResponse } from 'src/app/interfaces/IResponse';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { UserRoles, UserStatus } from 'src/app/utility/constants/other-constant';
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
  @Input() public employee: any;

  protected showPassword: boolean = false;
  protected showConfirmPassword: boolean = false;

  protected employeeForm: FormGroup;
  protected previewUrl: string | ArrayBuffer | null = null;
  protected selectedFile: File | null = null;

  protected roleList: Record<string, string>[] = UserRoles;
  protected statusList: Record<string, string>[] = UserStatus;

  constructor(
    private readonly fb: FormBuilder,
    private readonly employeeService: EmployeeService
  ) {
    super();
    this.createForm();
  }

  ngOnInit() {}

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
            alertSuccess(
              {
                title: RESPONSE_TITLES.SUCCESS,
                text:
                  createRes.body.message ||
                  RESPONSE_MESSAGES.EMPLOYEE_ADD_EDIT_SUCCESS,
              },
              () => this.onCloseModal()
            );
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                createRes.body.message ||
                RESPONSE_MESSAGES.EMPLOYEE_ADD_EDIT_FAILED,
            });
          }
        },
        error: (err: any) => {
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
}
