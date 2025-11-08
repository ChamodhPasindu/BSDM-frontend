import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  activeTab: string;
  isEditing = false;
  darkMode = false;

  constructor(){
    this.activeTab = 'profile'
  }

  user = {
    image: '',
    name: 'Chamodh Pasindu',
    nic: '991234567V',
    license: 'B1234567',
    email: 'chamodh@example.com',
    mobile: '0771234567'
  };

  password = { current: '', new: '', confirm: '' };

  vehicle = {
    model: 'Panda Cross 2016',
    brand: 'Geely',
    noPlate: 'CBA-4567',
    licenseExpiry: '2027-08-15'
  };

  enableEdit() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
  }

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

  toggleDarkMode() {
    document.body.classList.toggle('dark-theme', this.darkMode);
  }

}
