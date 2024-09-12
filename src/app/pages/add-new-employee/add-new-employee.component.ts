import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { EmployeesService } from '../../services/employees/employees.service';
import { MatIconModule } from '@angular/material/icon';

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
    RouterLink
  ],
  templateUrl: './add-new-employee.component.html',
  styleUrls: ['./add-new-employee.component.scss']
})
export class AddNewEmployeeComponent implements OnInit {
  companyStartDate: Date = new Date('2008-01-01');
  employees: any;
  employeeId: any;
  addNewemployeeForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    address: new FormControl('', [Validators.required]),
    salary: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    dateOfContract: new FormControl('', [Validators.required, this.dateOfContractValidator.bind(this)]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^01[0-9]{9}$')]),
    attendence: new FormControl('', [Validators.required]),
    leave: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    nationality: new FormControl('', [Validators.required]),
    nationalNumber: new FormControl('', [Validators.required, Validators.pattern('^([1-9]{1})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})[0-9]{3}([0-9]{1})[0-9]{1}$')]),
    department: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required, this.ageValidator.bind(this)])
  });

  constructor(
    private EmployeesServices: EmployeesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.employeeId = this.activatedRoute.snapshot.params['id'];
    if (this.employeeId) {
      this.EmployeesServices.getEmployeeById(this.employeeId).subscribe((data: any) => {
        this.addNewemployeeForm.patchValue(data);
      });
    }
  }

  employee(e: any) {
    e.preventDefault();
    if (this.addNewemployeeForm.valid && this.hasNonEmptyFields()) {
      if (this.employeeId) {
        this.EmployeesServices.updateEmployee(this.employeeId, this.addNewemployeeForm.value).subscribe(() => {
          this.router.navigate(['/employees']);
          this.addNewemployeeForm.reset();
        });
      } else {
        this.EmployeesServices.addNewEmployee(this.addNewemployeeForm.value).subscribe(() => {
          this.router.navigate(['/employees']);
          this.addNewemployeeForm.reset();
        });
      }
    }
  }
  private hasNonEmptyFields(): boolean {
    const formValues = this.addNewemployeeForm.value;
    return Object.values(formValues).some(value => value !== '' && value !== null);
  }

  deleteHandler(employeeId: any) {
    this.EmployeesServices.deleteEmployee(employeeId).subscribe(() => {
      this.employees = this.employees.filter((employee: any) => employee.id != employeeId);
    });
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
