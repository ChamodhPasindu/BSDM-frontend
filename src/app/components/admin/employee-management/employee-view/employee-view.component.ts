import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from 'src/app/interfaces/IResponse';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { UserRoles } from 'src/app/utility/constants/other-constant';
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
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(USERNAME_MIN_LENGTH),
            Validators.maxLength(USERNAME_MAX_LENGTH),
          ],
        ],
        name: ['', [Validators.required, Validators.pattern(REGEX_NAME)]],
        nic: ['', [Validators.required, Validators.pattern(REGEX_NIC)]],
        email: ['', [Validators.required, Validators.pattern(REGEX_EMAIL)]],
        role: ['', Validators.required],
        mobileNumber: [
          '',
          [Validators.required, Validators.pattern(REGEX_MOBILE)],
        ],
        profileImage: ['', [Validators.required]],
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

    console.log(this.employeeForm.value);

    this.employeeService
      .createEmployee(this.employeeForm.value)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            alertSuccess(
              {
                title: RESPONSE_TITLES.SUCCESS,
                text:
                  res.body.message ||
                  RESPONSE_MESSAGES.EMPLOYEE_ADD_EDIT_SUCCESS,
              },
              () => {
                this.onCloseModal();
              }
            );
          } else {
            alertError({
              title: RESPONSE_TITLES.FAILED,
              text:
                res.body.message || RESPONSE_MESSAGES.EMPLOYEE_ADD_EDIT_FAILED,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          errorMessageHandler(err);
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
