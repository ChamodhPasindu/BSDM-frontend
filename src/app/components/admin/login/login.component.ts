import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserRole } from 'src/app/enums/UserRole.enum';
import { IResponse } from 'src/app/interfaces/IResponse';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import { RESPONSE_MESSAGES } from 'src/app/utility/constants/response-message';
import { SESSION_DATA } from 'src/app/utility/constants/session-data';
import { alertError, onValidate } from 'src/app/utility/helper';
import { environment } from 'src/environment/environment';

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  protected readonly version = environment.version;

  protected loginForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly storageService: StorageService
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  protected createForm(): void {
    this.loginForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
    });
  }

  protected onSubmit(): void {
    if (!onValidate(this.loginForm)) return;

    const { username, password } = this.loginForm.value;

    this.authService
      .signIn(username, password)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: IResponse) => {
          if (response.body.status === RSP_SUCCESS) {
            if (response.body.content.role === UserRole.SALESMAN) {
              alertError({
                title: 'Login Failed',
                text: RESPONSE_MESSAGES.INVALID_ROLE_ERROR_DES,
              });
            } else {
              this.storageService.set(
                SESSION_DATA.ROLE,
                response.body.content.role
              );
              this.storageService.set(
                SESSION_DATA.NAME,
                response.body.content.name
              );
              this.storageService.set(
                SESSION_DATA.ACCESS_TOKEN,
                response.body.content.accessToken
              );
              this.storageService.set(
                SESSION_DATA.TOKEN_TYPE,
                response.body.content.tokenType
              );
              this.storageService.set(
                SESSION_DATA.REFRESH_TOKEN,
                response.body.content.refreshToken
              );
              this.storageService.set(
                SESSION_DATA.USERNAME,
                response.body.content.username
              );

              this.router.navigate(['post-login'], { relativeTo: this.route });
            }
          } else {
            alertError({
              title: 'Login Failed',
              text: response.body.message || RESPONSE_MESSAGES.COMMON_ERROR_DES,
            });
          }
        },
        error: (error: HttpErrorResponse) => {
          alertError({
            title: 'Login Failed',
            text:
              error.error?.message ||
              RESPONSE_MESSAGES.UNABLE_TO_SERVE_REQUEST_DES,
          });
        },
      });
  }
}
