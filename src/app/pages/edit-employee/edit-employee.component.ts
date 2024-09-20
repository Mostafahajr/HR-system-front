import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesService } from './../../services/employees/employees.service';
import { DepartmentsService, department } from './../../services/departments/departments.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Employee } from '../../models/iEmployee';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})

export class EditEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employeeId: number;
  departments: department[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeesService,
    private departmentsService: DepartmentsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      phone_number: ['', [Validators.required, Validators.maxLength(15)]],
      gender: ['', [Validators.required]],
      DOB: ['', [Validators.required, this.dobValidator]],
      nationality: ['', [Validators.required, Validators.maxLength(255)]],
      national_id: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
      arrival_time: ['', [Validators.required]],
      leave_time: ['', [Validators.required]],
      salary: ['', [Validators.required, Validators.min(0)]],
      date_of_contract: ['', [Validators.required, this.dateOfContractValidator]],
      department_id: [null, [Validators.required]]
    }, { validators: this.leaveTimeValidator });

    this.employeeId = 0;
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.route.paramMap.subscribe(params => {
      const employeeIdStr = params.get('id');
      if (employeeIdStr) {
        this.employeeId = +employeeIdStr;
        this.getEmployee(this.employeeId);
      }
    });
  }

  loadDepartments(): void {
    this.departmentsService.getDepartments().subscribe(
      (response: any) => {
        this.departments = response.data;
      },
      (error) => {
        console.error('Error fetching departments', error);
      }
    );
  }

  private getEmployee(id: number): void {
    this.employeeService.getEmployeeById(id).subscribe(
      (response: any) => {
        const employee = response.data;
        this.employeeForm.patchValue({
          name: employee.name,
          address: employee.address,
          phone_number: employee.phone_number,
          gender: employee.gender,
          DOB: this.formatDateForForm(employee.DOB),
          nationality: employee.nationality,
          national_id: String(employee.national_id), // Explicitly convert to string
          arrival_time: this.formatTimeForView(employee.arrival_time), // Ensure format is HH:MM
          leave_time: this.formatTimeForView(employee.leave_time), // Ensure format is HH:MM
          salary: employee.salary,
          date_of_contract: this.formatDateForForm(employee.date_of_contract),
          department_id: employee.department?.id
        });
      },
      (error) => {
        console.error('Error fetching employee data', error);
      }
    );
  }



  onSubmit() {
    if (this.employeeForm.valid) {
      const formData = { ...this.employeeForm.value };
      formData.date_of_contract = this.formatDateForSubmission(formData.date_of_contract);
      formData.DOB = this.formatDateForSubmission(formData.DOB);
      formData.arrival_time = this.formatTimeForSubmission(formData.arrival_time);
      formData.leave_time = this.formatTimeForSubmission(formData.leave_time);
  
      this.employeeService.updateEmployee(this.employeeId, formData).subscribe(
        (response) => {
          console.log('Employee updated successfully:', response);
          this.router.navigate(['/employees']);
        },
        (error) => {
          console.error('Error updating employee:', error);
        }
      );
    } else {
      console.log('Form is invalid', this.employeeForm.errors);
    }
  }
  


  private formatTimeForView(time: string): string {
    // Return only the time part in H:i:s format
    return time ? time.split('T')[1].substring(0, 8) : '00:00:00'; // Ensure HH:MM:SS format
  }
  
  private formatTimeForSubmission(time: string): string {
    // Ensure time is in H:i:s format for submission
    return time ? time : '00:00:00'; // Keep format as H:i:s
  }
  




  private dobValidator(control: any) {
    const dob = new Date(control.value);
    const today = new Date();
    return dob < today ? null : { dobInvalid: true };
  }

  private dateOfContractValidator(control: any) {
    const dateOfContract = new Date(control.value);
    const dob = new Date(control.parent?.get('DOB')?.value);
    return dateOfContract >= dob ? null : { dateOfContractInvalid: true };
  }

  private leaveTimeValidator(group: FormGroup) {
    const arrivalTime = group.get('arrival_time')?.value;
    const leaveTime = group.get('leave_time')?.value;
    if (arrivalTime && leaveTime) {
      return arrivalTime < leaveTime ? null : { leaveTimeInvalid: true };
    }
    return null;
  }

  private formatDateForForm(date: string): string {
    return date ? date.split('T')[0] : '';
  }

  private formatDateForSubmission(date: string): string {
    return date ? new Date(date).toISOString().split('T')[0] : '';
  }

  formatTime(controlName: string): void {
    const control = this.employeeForm.get(controlName);
    if (control && control.value) {
      const formattedTime = this.formatTimeForView(control.value);
      control.setValue(formattedTime, { emitEvent: false });
    }
  }

}