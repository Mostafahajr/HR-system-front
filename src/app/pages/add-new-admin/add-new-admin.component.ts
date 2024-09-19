import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { EmployeesService } from '../../services/employees/employees.service';

@Component({
  selector: 'app-add-new-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatButton,
  ],
  templateUrl: './add-new-admin.component.html',
  styleUrls: ['./add-new-admin.component.scss'],
})
export class AddNewAdminComponent {
  admins: any;
  hide = true;
  addNewAdminForm = new FormGroup({
    fullName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    userName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      ),
    ]),
    permession: new FormControl('', [Validators.required]),
  });
  constructor(private EmployeesServices: EmployeesService) {}
  admin(e: any) {
    e.preventDefault();
    this.EmployeesServices.getAllEmployees().subscribe({
      next: (response) => {
        this.admins = response;
        if (this.addNewAdminForm.valid && this.hasNonEmptyFields()) {
          this.EmployeesServices.addNewEmployee(
            this.addNewAdminForm.value
          ).subscribe({
            next: (response) => {
              console.log('admin added successfully', response);
              this.addNewAdminForm.reset();
            },
          });
        }
      },
    });
  }
  private hasNonEmptyFields(): boolean {
    const formValues = this.addNewAdminForm.value;
    return Object.values(formValues).some(
      (value) => value !== '' && value !== null
    );
  }
}
