import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { alertWarning } from 'src/app/utility/helper';
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

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly storageService: StorageService
  ) {
    this.activeTab = SettingsTab.PROFILE;
  }

  ngOnInit() {
    this.isDarkMode = localStorage.getItem('dark-theme') === '1';
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
      }
    );
  }

  user = {
    image: '',
    name: 'Chamodh Pasindu',
    nic: '991234567V',
    license: 'B1234567',
    email: 'chamodh@example.com',
    mobile: '0771234567',
  };

  password = { current: '', new: '', confirm: '' };

  vehicle = {
    model: 'Panda Cross 2016',
    brand: 'Geely',
    noPlate: 'CBA-4567',
    licenseExpiry: '2027-08-15',
  };

  saveChanges() {
    this.isEditing = false;
    alert('Profile updated successfully!');
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.user.image = e.target.result);
      reader.readAsDataURL(file);
    }
  }

  changePassword() {
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
