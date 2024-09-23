 import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { EmployeesService } from '../../services/employees/employees.service';
import { MatIconModule } from '@angular/material/icon';
import { Department, DepartmentsService } from '../../services/departments/departments.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-add-new-employee',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterOutlet,
    MatSelectModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
    RouterLink,
    MatSnackBarModule
  ],
  templateUrl: './add-new-employee.component.html',
  styleUrls: ['./add-new-employee.component.scss']
})


export class AddNewEmployeeComponent implements OnInit {
  companyStartDate: Date = new Date('2008-01-01');
  departments: Department[] = [];  // List to store departments
  employeeId: any;

  addNewemployeeForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    address: new FormControl('', [Validators.required]),
    salary: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    date_of_contract: new FormControl('', [Validators.required, this.dateOfContractValidator.bind(this)]),
    phone_number: new FormControl('', [Validators.required, Validators.pattern('^01[0-9]{9}$')]),
    arrival_time: new FormControl('', [Validators.required]),
    leave_time: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    nationality: new FormControl('', [Validators.required]),
    national_id: new FormControl('', [Validators.required, Validators.pattern('^([1-9]{1})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})[0-9]{3}([0-9]{1})[0-9]{1}$')]),
    department_id: new FormControl(null, [Validators.required]),  // Updated for department selection
    DOB: new FormControl('', [Validators.required, this.ageValidator.bind(this)])
  }, { validators: this.leaveTimeValidator() });

  constructor(
    private employeesService: EmployeesService,
    private departmentsService: DepartmentsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDepartments();  // Load departments on page initialization
    this.employeeId = this.activatedRoute.snapshot.params['id'];
    if (this.employeeId) {
      this.employeesService.getEmployeeById(this.employeeId).subscribe((data: any) => {
        this.addNewemployeeForm.patchValue(data);
      });
    }
  }

  // Load departments for department selection
  loadDepartments(): void {
    this.departmentsService.getDepartments().subscribe(
      (response: any) => {
        if (response && response.data && Array.isArray(response.data)) {
          this.departments = response.data;  // Assign fetched departments
        } else {
          this.departments = [];  // Fallback to empty list if no data
        }
      },
      (error) => {
        console.error('Error fetching departments', error);
      }
    );
  }

  employee(e: any) {
    e.preventDefault();
  
    if (this.addNewemployeeForm.valid && this.hasNonEmptyFields()) {
      let formData = { ...this.addNewemployeeForm.value };
  
      formData = this.cleanFormData(formData);
      formData.arrival_time = this.formatTimeForSubmission(formData.arrival_time);
      formData.leave_time = this.formatTimeForSubmission(formData.leave_time);
  
      if (this.employeeId) {
        this.employeesService.updateEmployee(this.employeeId, formData).subscribe(() => {
          this.showToast('Employee updated successfully!');
          this.router.navigate(['/employees']);
          this.addNewemployeeForm.reset();
        });
      } else {
        this.employeesService.addNewEmployee(formData).subscribe(() => {
          this.showToast('Employee added successfully!');
          this.router.navigate(['/employees']);
          this.addNewemployeeForm.reset();
        });
      }
    }
  }
  showToast(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,  // Duration in milliseconds
      horizontalPosition: 'center',  // Position to the right
      verticalPosition: 'bottom', 
      panelClass: ['custom-snackbar'], // Position at the top
    });
  }
    
  private cleanFormData(formData: any): any {
    Object.keys(formData).forEach(key => {
      formData[key] = formData[key] ?? '';  // Replace undefined or null with an empty string
    });
    return formData;
  }

  private formatTimeForSubmission(time: string | null | undefined): string {
    if (time) {
      const parts = time.split(':');
      return parts.length === 2 ?` ${time}:00` : time;  // Ensure HH:mm:ss format
    }
    return '00:00:00'; // Default to '00:00:00' if time is null or undefined
  }

  private hasNonEmptyFields(): boolean {
    const formValues = this.addNewemployeeForm.value;
    return Object.values(formValues).some(value => value !== '' && value !== null);
  }

  private dateOfContractValidator(control: any) {
    const contractDate = new Date(control.value);
    if (contractDate < this.companyStartDate) {
      return { beforeCompanyStartDate: true };
    }
    return null;
  }

  private ageValidator(control: any) {
    const birthDate = new Date(control.value);
    const ageAtStartDate = this.calculateAge(birthDate, this.companyStartDate);

    if (ageAtStartDate < 20) {
      return { underAge: true };
    }
    return null;
  }

  private leaveTimeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const group = control as FormGroup;
      const arrivalTime = group.get('arrival_time')?.value;
      const leaveTime = group.get('leave_time')?.value;
      if (arrivalTime && leaveTime) {
        return arrivalTime < leaveTime ? null : { leaveTimeInvalid: true };
      }
      return null;
    };
  }

  private calculateAge(birthDate: Date, referenceDate: Date): number {
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();

    const referenceYear = referenceDate.getFullYear();
    const referenceMonth = referenceDate.getMonth();
    const referenceDay = referenceDate.getDate();

    let age = referenceYear - birthYear;

    if (referenceMonth < birthMonth || (referenceMonth === birthMonth && referenceDay < birthDay)) {
      age--;
    }
    return age;
  }
}