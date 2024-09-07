import { EmployeesService } from './../../services/employees/employees.service';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [BreadcrumbsComponent ,ReactiveFormsModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
  // providers:[EmployeesService],
})
export class EmployeesComponent implements OnInit{
  employees:any;
  constructor(private EmployeesServices:EmployeesService){
    }
    employeeForm =new FormGroup({
      name: new FormControl(),
      salary: new FormControl()
  });
  ngOnInit():void{
    this.employee
}
edithandeler(){
  this.EmployeesServices.editEmployee(this.employee, this.employeeForm.value)
    .subscribe({
      next: (response) => {
        console.log('Employee Edited Successfully',response);
      },
    });
}
updateEmployee(){
  this.EmployeesServices.updateEmployee(this.employees.id, this.employeeForm.value).subscribe({
    next: (response) => {
      console.log('Employee updated successfully', response);
      this.employee;
}
});
}
deleteHandler(employeeId: any) {
this.EmployeesServices.deleteEmployee(employeeId).subscribe({
  next: () => {
    this.employees = this.employees.filter(
      (employee: any) => employee.id != employeeId
    );
  },
});
}
    employee(e: any) {
      e.preventDefault();
      this.EmployeesServices.getAllEmployees().subscribe({
        next: (response) => {
          this.employees=response;
          this.EmployeesServices.addNewEmployee(this.employeeForm.value).subscribe({
            next:(response)=>{
              console.log('Employee Added Successfully',response);
            }
          })
        },

      });
    }
 
    }

