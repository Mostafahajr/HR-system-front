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
import { AdminsService } from '../../services/admins/admins.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

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
  groups: any;
  hide = true;

  addNewAdminForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern(/^[A-Za-z ]{3,}$/),
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern(/^[A-Za-z ]{3,}$/),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    group_type_id: new FormControl('', [Validators.required]),
  });

  constructor(
    private userService: AdminsService,
    private router: Router,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userService.getGroups().subscribe({
      next: (response) => {
        console.log(response.data);
        this.groups = response.data;
      },
    });
  }

  admin(e: any) {
    if (this.addNewAdminForm.valid) {
      this.userService.recordUser(this.addNewAdminForm.value).subscribe({
        next: (response) => {
          console.log(response);
          
          this.showToast('Admin added successfully!'); // toast add

          // Redirect to admins page
          this.router.navigate([`admins`]);
        },
        error: (error) => {
          console.log(error);

          // Call the reusable showToast function on error
          this.showToast('Failed to add admin');
        },
      });
    }
  }

  // Reusable toast function
  showToast(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,  // Duration in milliseconds
      horizontalPosition: 'center',  // Position to the right
      verticalPosition: 'bottom', 
      panelClass: ['custom-snackbar'], // Position at the top
    });
  }

  private hasNonEmptyFields(): boolean {
    const formValues = this.addNewAdminForm.value;
    return Object.values(formValues).some(
      (value) => value !== '' && value !== null
    );
  }
}
