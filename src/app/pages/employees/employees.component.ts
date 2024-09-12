import { EmployeesService } from './../../services/employees/employees.service';
import { Component, OnInit, ViewChild , AfterViewInit} from '@angular/core';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import {  ReactiveFormsModule } from '@angular/forms';
import { Router ,RouterOutlet} from '@angular/router';
import { MatButton } from '@angular/material/button';
import { AddNewEmployeeComponent } from "../add-new-employee/add-new-employee.component";
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { CommonModule } from '@angular/common';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [BreadcrumbsComponent, ReactiveFormsModule, MatButton, AddNewEmployeeComponent,RouterOutlet,MatTableModule,CommonModule,MatPaginatorModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
})

export class EmployeesComponent implements OnInit,AfterViewInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  employees: any[] = [];
  showForm = false;
  displayedColumns: string[] = ['name', 'address', 'phone_number','DOB','nationality','salary','date_of_contract','department'];
  dataSource = new MatTableDataSource<any>([]);

  constructor(private employeesService: EmployeesService, private router: Router) {
    this.router.events.subscribe(() => {
      this.showForm = this.router.url.includes('employees/add-new-employee');
    });
  }
  ngOnInit(): void {
    this.getEmployees();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  getEmployees(): void {
    this.employeesService.getAllEmployees().subscribe(response => {
      console.log('API Response:', response);
      this.employees = response.data.map((employee: any) => ({
        ...employee,
        department_name: employee.department ? employee.department.name : 'N/A' // Ensure department_name is mapped correctly
      }));
      this.dataSource.data = this.employees; // Update the data source for the table
    }, error => {
      console.error('Error fetching employee data', error);
    });
  }
  // getEmployees(): void {
  //   this.employeesService.getAllEmployees().subscribe(response => {
  //     console.log('API Response:', response);
  //     // Filter employees where the date_of_contract is after or equal to '2008-01-01'
  //     this.employees = response.data.filter((employee: any) => {
  //       const contractDate = new Date(employee.date_of_contract);
  //       const filterDate = new Date('2008-01-01');
  //       return contractDate >= filterDate;
  //     });
  //     this.dataSource.data = this.employees; // Update the data source for the table
  //   }, error => {
  //     console.error('Error fetching employee data', error);
  //   });
  // }
  navigate(route: string) {
    this.router.navigate([route]);
  }
}
  

