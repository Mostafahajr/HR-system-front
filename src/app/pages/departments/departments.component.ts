import { EmployeeService } from './../../services/employee-excelsheet/employee.service';

import { DepartmentsService } from './../../services/departments/departments.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Department } from '../../models/iDepartment';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeesService } from '../../services/employees/employees.service';
import { Employee, EmployeesByDepartment } from '../../models/iEmployee';


@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [BreadcrumbsComponent, MatPaginator, MatTableModule, RouterLink, MatIcon, RouterOutlet, ReactiveFormsModule, MatError, NgIf, MatButton, MatCommonModule, MatInputModule, FormsModule],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit, AfterViewInit {
  constructor(private departmenServices: DepartmentsService, private router: Router, private employeesService : EmployeesService,private snackBar: MatSnackBar) { }
  employees: Employee[] = [];

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


  // Department-related methods
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


  isDepartmentRoute(): boolean {
    return this.router.url === '/departments';
  }



  generateExcelFiles(): void {
    this.employeesService.getAllEmployees().subscribe((response: any) => {
      const employees: Employee[] = response.data;

      // Group employees by department
      const employeesByDepartment: EmployeesByDepartment = employees.reduce((acc: EmployeesByDepartment, employee: Employee) => {
        const departmentName = employee.department?.name || 'Unassigned'; // Handle null department
        if (!acc[departmentName]) {
          acc[departmentName] = [];
        }
        acc[departmentName].push({
          Name: employee.name || 'Unknown',
          ArrivalTime: employee.arrival_time ? new Date(employee.arrival_time).toLocaleString() : '',
          DepartureTime: employee.leave_time ? new Date(employee.leave_time).toLocaleString() : ''
        });
        return acc;
      }, {} as EmployeesByDepartment); // Explicitly typing the accumulator

      // Generate Excel files for each department
      for (const [departmentName, empList] of Object.entries(employeesByDepartment)) {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(empList);
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, departmentName);

        // Create a file name for each department
        const fileName = `${departmentName.replace(/\s+/g, '_')}_Employees_2024-09-06.xlsx`;
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveExcelFile(excelBuffer, fileName);
      }
    });
  }

  printDepartment(department: any): void {
    this.employeesService.getAllEmployees().subscribe((response: any) => {
        const employees: Employee[] = response.data;

        // Filter employees by the selected department
        const filteredEmployees = employees.filter(employee => employee.department?.name === department.department_name);

        // Prepare data for Excel
        const empList = filteredEmployees.map(employee => ({
            Name: employee.name || 'Unknown',
            ArrivalTime: '',  // Set to empty or your actual data
            DepartureTime: ''  // Set to empty or your actual data
        }));

        // Get today's date
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        // Create worksheet and workbook
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(empList);
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, department.department_name);

        // Create a file name for the department using today's date
        const fileName = `${department.department_name.replace(/\s+/g, '_')}_${formattedDate}.xlsx`;
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveExcelFile(excelBuffer, fileName);
    });
}



  formatTime(dateTime: string): string {
    const date = new Date(dateTime);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(data, fileName);
  }
}
