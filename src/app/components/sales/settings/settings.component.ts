import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResponse } from 'src/app/interfaces/IResponse';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { StorageService } from 'src/app/services/storage.service';
import { RSP_SUCCESS } from 'src/app/utility/constants/response-code';
import {
  RESPONSE_MESSAGES,
  RESPONSE_TITLES,
} from 'src/app/utility/constants/response-message-title';
import {
  REGEX_EMAIL,
  REGEX_MOBILE,
  REGEX_NAME,
  REGEX_NIC,
} from 'src/app/utility/constants/validation';
import {
  alertError,
  alertWarning,
  errorMessageHandler,
} from 'src/app/utility/helper';
import { SweetAlertResult } from 'sweetalert2';

export enum SettingsTab {
  PROFILE = 'profile',
  PASSWORD = 'password',
  VEHICLE = 'vehicle',
  OTHERS = 'Others',
}

@UntilDestroy()
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  protected readonly SettingsTab = SettingsTab;
  protected activeTab: SettingsTab;

  protected isEditing: boolean = false;
  protected isDarkMode: boolean = false;

  protected profileImg: string = './assets/images/user-img.jpg';

  protected profileForm: FormGroup;

  protected vehicleDetails: Record<string, string>;
  protected otherDetails: Record<string, string>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly storageService: StorageService,
    private readonly employeeService: EmployeeService,
  ) {
    this.activeTab = SettingsTab.PROFILE;
    this.createForm();
  }

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('dark-theme') === '1';

    this.employeeService
      .getProfileDetails()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: IResponse) => {
          if (res.body.status === RSP_SUCCESS) {
            this.profileForm.patchValue(res.body.content.profile);
            this.profileImg = res.body.content.profile.profileImg;
            this.vehicleDetails = res.body.content.vehicleDetails;
            this.otherDetails = res.body.content.otherSettings;
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

  private createForm(): void {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.pattern(REGEX_NAME)]],
      email: ['', [Validators.required, Validators.pattern(REGEX_EMAIL)]],
      nic: ['', [Validators.required, Validators.pattern(REGEX_NIC)]],
      mobile: ['', [Validators.required, Validators.pattern(REGEX_MOBILE)]],
    });
  }

  protected onLogOut(): void {
    alertWarning(
      {
        title: 'Log Out',
        text: 'Are you sure you want to log out?',
      },
      (result: SweetAlertResult<any>) => {
        if (result.isConfirmed) {
          this.authService
            .logout()
            .pipe(untilDestroyed(this))
            .subscribe(() => {
              this.router.navigate(['sales']);
              this.storageService.clearSession();
            });
        }
      },
    );
  }

  password = { current: '', new: '', confirm: '' };

  protected onProfileSubmit(): void {}

  protected saveChanges(): void {
    this.isEditing = false;
    alert('Profile updated successfully!');
  }

  protected onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.profileImg = e.target.result);
      reader.readAsDataURL(file);
    }
  }

  protected changePassword(): void {
    if (this.password.new !== this.password.confirm) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password updated successfully!');
    this.password = { current: '', new: '', confirm: '' };
  }

  protected enableEdit(): void {
    this.isEditing = true;
  }

  protected cancelEdit(): void {
    this.isEditing = false;
  }

  protected toggleDarkMode(): void {
    document.body.classList.toggle('dark-theme', this.isDarkMode);
    localStorage.setItem('dark-theme', this.isDarkMode ? '1' : '0');
  }
}
