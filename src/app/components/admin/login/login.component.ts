import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  protected readonly version = environment.version;

  loginForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  createForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  // Validate the form and mark controls
  onValidate(): boolean {
    this.submitted = true;
    this.loginForm.markAllAsTouched();
    return this.loginForm.valid;
  }

  onSubmit() {
    if (!this.onValidate()) return;

    // Proceed if valid
    console.log('Form submitted:', this.loginForm.value);
    alert('Login Successful!');
  }

  onReset() {
    this.submitted = false;
    this.loginForm.reset();
  }
}
