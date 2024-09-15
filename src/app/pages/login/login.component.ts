import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^\w+([\.-]?\w)+@\w+([\.]?\w)+(\.[a-zA-Z]{2,3})+$/ // Email pattern validation
          ),
        ],
      ],
      password: ['', [Validators.required]], // Password validation
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Call onLogin to handle authentication
      this.onLogin();
    } else {
      console.error('Form is invalid');
    }
  }

  onLogin(): void {
    const email = this.email?.value;
    const password = this.password?.value;

    if (email && password) {
      this.authService
        .login(email, password)
        .pipe(
          tap((response) => {
            console.log('Login successful', response);
            // Redirect to the home page after successful login
            this.router.navigate(['/']);
          }),
          catchError((error) => {
            console.error('Login failed', error);
            // Handle the error as necessary
            return of(null); // Return a safe observable value
          })
        )
        .subscribe();
    } else {
      console.error('Email or password is missing');
    }
  }
}
