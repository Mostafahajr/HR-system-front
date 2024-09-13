import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w)+@\w+([\.]?\w)+(\.[a-zA-Z]{2,3})+$/)]],
      password: ['', [Validators.required, this.passwordValidator]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  // Custom validator for password
  passwordValidator(control: any) {
    const password = control?.value;
    if (!password) return null;

    // Regex patterns for validation
    const capitalLetterPattern = /^[A-Z]/; // Starts with a capital letter
    const lengthPattern = /.{8,}/; // At least 8 characters
    const numberPattern = /\d/; // Contains at least one number
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/; // Contains at least one special character

    const hasCapitalLetter = capitalLetterPattern.test(password);
    const hasNumber = numberPattern.test(password);
    const hasSpecialChar = specialCharPattern.test(password);
    const isValidLength = lengthPattern.test(password);

    return hasCapitalLetter && hasNumber && hasSpecialChar && isValidLength
      ? null
      : { pattern: true };
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Handle login logic here
      console.log('Email:', this.loginForm.value.email, 'Password:', this.loginForm.value.password);
    }
  }
}
