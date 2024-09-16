import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesService } from './../../services/employees/employees.service';
import { OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatIcon,MatButton],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.scss'
})
export class EditEmployeeComponent implements OnInit {
  companyStartDate: Date = new Date('2008-01-01');
  employeeForm: FormGroup;
  employeeId: number;

  constructor(
    private employeeService: EmployeesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      salary: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      date_of_contract: new FormControl('', [Validators.required, this.dateOfContractValidator.bind(this)]),
      phone_number: new FormControl('', [Validators.required, Validators.pattern('^01[0-9]{9}$')]),
      arrival_time: new FormControl('', [Validators.required]),
      leave_time: new FormControl('', [Validators.required]),
      national_id: new FormControl('', [Validators.required, Validators.pattern('^\\d{9}$')]),
      department: new FormControl('', [Validators.required]),
    });

    this.employeeId = this.route.snapshot.params['id'];
  }

  private dateOfContractValidator(control: any) {
    const contractDate = new Date(control.value);
    if (contractDate < this.companyStartDate) {
      return { beforeCompanyStartDate: true };
    }
    return null;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const employeeIdStr = params.get('id'); // Get the 'id' parameter from the route
      if (employeeIdStr) {
        const employeeId = Number(employeeIdStr);
        if (!isNaN(employeeId)) {
          this.getEmployee(employeeId); // Fetch and display the employee with the given ID
        } else {
          console.error('Invalid employee ID:', employeeIdStr);
        }
      } else {
        console.error('No employee ID found in the route');
      }
    });
  }
  getEmployee(id: number): void {
    this.employeeService.getEmployeeById(id).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        const employeeData = response.data;

        // Patch the employee data into the form
        this.employeeForm.patchValue({
          name: employeeData.name,
          salary: employeeData.salary,
          date_of_contract: new Date(employeeData.date_of_contract),
          phone_number: employeeData.phone_number,
          arrival_time: employeeData.arrival_time,
          leave_time: employeeData.leave_time,
          national_id: employeeData.national_id,
          department: employeeData.department ? employeeData.department.name : '',
        });
      },
      (error) => {
        console.error('Error fetching employee data', error);
      }
    );
  }

  formatTimeForForm(time: string): string {
    return time.split(' ')[1] || ''; // Extracts only the time part, returns empty string if undefined
  }

  formatDateForSubmission(date: string | Date): string {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    } else if (typeof date === 'string') {
      // If it's already a string, assume it's in the correct format
      return date.split('T')[0]; // Remove any time component if present
    }
    return ''; // Return empty string for invalid input
  }

  formatTimeForSubmission(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const now = new Date();
    now.setHours(Number(hours), Number(minutes), 0, 0);
    return now.toISOString().slice(0, 19).replace('T', ' ');
  }
  onSubmit() {
    if (this.employeeForm.valid) {
      const formData = this.employeeForm.value;
      formData.date_of_contract = this.formatDateForSubmission(formData.date_of_contract);
      formData.DOB = this.formatDateForSubmission(formData.DOB);
      formData.arrival_time = this.formatTimeForSubmission(formData.arrival_time);
      formData.leave_time = this.formatTimeForSubmission(formData.leave_time);
  
      this.employeeService.updateEmployee(this.employeeId, formData).subscribe(
        (response) => {
          console.log('Employee updated successfully:', response);
          this.router.navigate(['/employees']); // Redirect after success
        },
        (error) => {
          console.error('Error updating employee:', error);
        }
      );
    } else {
      console.log('Form is invalid', this.employeeForm.errors); // Add more details to the log
    }
  }
}
