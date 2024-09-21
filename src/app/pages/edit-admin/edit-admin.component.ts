import { Group } from './../../models/iGroup';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { EmployeesService } from '../../services/employees/employees.service';
import { AdminsService } from '../../services/admins/admins.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-admin',
  standalone: true,
  imports: [ReactiveFormsModule, MatSelectModule, MatFormFieldModule, MatInputModule, FormsModule, CommonModule, MatIconModule, MatButton],
  templateUrl: './edit-admin.component.html',
  styleUrl: './edit-admin.component.scss'
})
export class EditAdminComponent implements OnInit {

  selectedValue: string = '';
  admins: any;
  hide = true;
  adminId: any;
  groups: any[] = [];
  showPasswordField = false; // FOR CHANGE PASSWORD BUTTON

  constructor(private userService: AdminsService, private route: ActivatedRoute, private router: Router) {
    this.adminId = this.route.snapshot.params['id'];

    // Fetch admin data without preloading password
    this.userService.getUserById(this.adminId).subscribe({
      next: (response) => {
        this.getFullName.setValue(response.data.name);
        this.getUsername.setValue(response.data.username);
        this.getEmail.setValue(response.data.email);
        // Do not set password
        this.getPermission.setValue(response.data.group_type_id);
      }
    });
  }
  ngOnInit(): void {
    this.userService.getGroups().subscribe({
      next: (response) => {

        console.log(response.data);

        this.groups = response.data;
      }
    })
  }

  updateAdminForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[A-Za-z ]{3,}$/)]),
    username: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9 (.|*|&|^|%|@)]{3,}$/)]), email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.pattern(/^[A-Za-z0-9(@|#|$|%)]{8,}$/)]),
    group_type_id: new FormControl('', [Validators.required])
  });

  get getFullName() {
    return this.updateAdminForm.controls['name']
  }
  get getUsername() {
    return this.updateAdminForm.controls['username']
  }
  get getEmail() {
    return this.updateAdminForm.controls['email']
  }
  get getPassword() {
    return this.updateAdminForm.controls['password']
  }
  get getPermission() {
    return this.updateAdminForm.controls['group_type_id']
  }

  admin(e: any) {
    e.preventDefault();
    // Check if the form is valid
    if (this.updateAdminForm.valid) {
      const formData = this.updateAdminForm.value;
      // Remove password from the form if it's empty
      if (!formData.password) {
        delete formData.password;
      }
      // Update admin with form data
      this.userService.updateuser(this.adminId, formData).subscribe({
        next: (response) => {
          console.log(response);
          // Navigate back to the AdminsComponent
          this.router.navigate(['/admins']);

        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  // Function to toggle the password field visibility
  togglePasswordField() {
    this.showPasswordField = !this.showPasswordField;
    if (!this.showPasswordField) {
      this.getPassword.reset();  // Reset the password if the user hides the field again
    }
  }

  private hasNonEmptyFields(): boolean {
    const formValues = this.updateAdminForm.value;
    return Object.values(formValues).some(value => value !== '' && value !== null);
  }


}
