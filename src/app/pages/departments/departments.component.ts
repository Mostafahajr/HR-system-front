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

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [BreadcrumbsComponent,MatPaginator,MatTableModule, RouterLink,MatIcon,RouterOutlet,ReactiveFormsModule,MatError,NgIf,MatButton,MatCommonModule,MatInputModule,FormsModule],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent implements OnInit, AfterViewInit {

  constructor(private departmenServices: DepartmentsService, private router: Router) { }

  departments: Department[] = [];  // Ensure you're using the Department interface
  displayedColumns: string[] = ['id', 'department', 'actions'];
  dataSource = new MatTableDataSource<Department>(this.departments);  // Updated with Department type
  editingDepartment: Department | null = null;  // Edited to ensure department follows the interface

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

  startEditing(department: Department): void {  // Use the Department type
    this.editingDepartment = { ...department };  // Clone department for editing
  }

  cancelEditing(): void {
    this.editingDepartment = null;
  }

  saveEdit(department: Department): void {  // Ensure the department follows the interface
    if (department && department.id && department.department_name) {
      this.departmenServices.updateDepartment(department.id, { department_name: department.department_name })
        .subscribe({
          next: (response) => {
            console.log('Department updated successfully', response);
            this.fetchDepartments();  // Refresh the department list
            this.editingDepartment = null;  // Exit edit mode
          },
          error: (err) => {
            console.error('Error updating department', err);
          }
        });
    }
  }

  department(e: any): void {
    e.preventDefault();
    console.log(this.addNewDepartmentForm.value);
  
    if (this.addNewDepartmentForm.valid && this.hasNonEmptyFields()) {
      const departmentNameValue = this.addNewDepartmentForm.value.department_name;
  
      const newDepartment: Partial<Department> = {
        department_name: departmentNameValue ?? '',
      };
  
      this.departmenServices.addNewDepartment(newDepartment).subscribe({
        next: (response) => {
          console.log('Department added successfully', response);
          this.addNewDepartmentForm.reset();
          this.addNewDepartmentForm.markAsPristine();
          this.addNewDepartmentForm.markAsUntouched();
          this.addNewDepartmentForm.updateValueAndValidity();
          this.fetchDepartments();
        },
        error: (err) => {
          console.error('Error adding department', err);
        }
      });
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
      switchMap(() => this.departmenServices.getDepartments()),  // Refresh the department list
      catchError(error => {
        console.error('Error deleting department', error);
        return throwError(() => new Error('Error deleting department'));
      })
    ).subscribe({
      next: (response: any) => {
        this.dataSource.data = response.data;  // Update the data source after deletion
      }
    });
  }
  isDepartmentRoute(){
    return this.router.url === '/departments';
  }

}
