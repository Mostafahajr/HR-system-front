import { DepartmentsService } from './../../services/departments/departments.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BreadcrumbsComponent } from "../../components/breadcrumbs/breadcrumbs.component";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { catchError, switchMap, throwError } from 'rxjs';
import { Department } from '../../models/iDepartment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [BreadcrumbsComponent, MatPaginator, MatTableModule, RouterLink, MatIcon, RouterOutlet, ReactiveFormsModule, MatError, NgIf, MatButton, MatCommonModule, MatInputModule, FormsModule],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit, AfterViewInit {
  constructor(private departmenServices: DepartmentsService, private router: Router, private snackBar: MatSnackBar) { }

  departments: Department[] = [];
  displayedColumns: string[] = ['id', 'department', 'actions'];
  dataSource = new MatTableDataSource<Department>(this.departments);
  editingDepartment: Department | null = null;

  addNewDepartmentForm = new FormGroup({
    department_name: new FormControl('', [Validators.required]),
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.fetchDepartments();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  startEditing(department: Department): void {
    this.editingDepartment = { ...department };
  }

  cancelEditing(): void {
    this.editingDepartment = null;
  }

  saveEdit(department: Department): void {
    if (department && department.id && department.department_name) {
      this.departmenServices.updateDepartment(department.id, { department_name: department.department_name })
        .subscribe({
          next: (response) => {
            this.showToast('Department updated successfully');
            this.fetchDepartments();
            this.editingDepartment = null;
          },
          error: (err) => {
            console.error('Error updating department', err);
            this.showToast('Error updating department');//toast for update
          }
        });
    }
  }

  department(e: any): void {
    e.preventDefault();
    if (this.addNewDepartmentForm.valid && this.hasNonEmptyFields()) {
      const departmentNameValue = this.addNewDepartmentForm.value.department_name;
      const newDepartment: Partial<Department> = { department_name: departmentNameValue ?? '' };
  
      this.departmenServices.addNewDepartment(newDepartment).subscribe({
        next: (response) => {
          console.log('Response from adding department:', response);
          this.showToast('Department added successfully');
          this.addNewDepartmentForm.reset();
          this.fetchDepartments();
        },
        error: (err) => {
          console.error('Error adding department:', err);
          this.showToast('Error adding department'); // Toast for adding
        }
      });
    } else {
      this.showToast('Please fill in the required fields.'); // Notify if form is invalid
    }
  }  

  private hasNonEmptyFields(): boolean {
    const formValues = this.addNewDepartmentForm.value;
    return Object.values(formValues).some(value => value !== '' && value !== null);
  }

  fetchDepartments(): void {
    this.departmenServices.getDepartments().subscribe((response: any) => {
      this.departments = response.data;
      this.dataSource.data = this.departments;
    });
  }

  deleteDepartment(id: number): void {
    this.departmenServices.deleteDepartment(id).pipe(
      switchMap(() => this.departmenServices.getDepartments()),
      catchError(error => {
        console.error('Error deleting department', error);
        return throwError(() => new Error('Error deleting department'));
      })
    ).subscribe({
      next: (response: any) => {
        this.dataSource.data = response.data;
        this.showToast('Department deleted successfully');//toast for delete
      }
    });
  }
//toast function
  showToast(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass:['custom-snackbar']
    });
  }

  isDepartmentRoute() {
    return this.router.url === '/departments';
  }
}
