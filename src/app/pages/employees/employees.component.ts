import { EmployeesService } from './../../services/employees/employees.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet ,RouterLink} from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [BreadcrumbsComponent, ReactiveFormsModule, MatButton, RouterOutlet, MatTableModule, CommonModule, MatPaginatorModule, MatIcon,RouterLink],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'], // Corrected to styleUrls
})

export class EmployeesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  employees: any[] = [];
  showForm = false;
  selectedEmployee: any = null;
  displayedColumns: string[] = ['name', 'department', 'phone_number', 'address', 'salary', 'arrival_time', 'leave_time', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  constructor(private employeesService: EmployeesService, private router: Router) {
    this.router.events.subscribe(() => {
      this.showForm = this.router.url.includes('employees/add-new-employee');
    });
  }
  isAddNewEmployeeRoute(){
    return this.router.url === '/employees';
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
        department_name: employee.department ? employee.department.name : 'N/A'
      }));
      this.dataSource.data = this.employees;
    }, error => {
      console.error('Error fetching employee data', error);
    });
  }
  showDetails(employeeId:number): void {
    // Navigate to the employee details page with the employee ID
    this.router.navigate([`employees/show/${employeeId}`]);
  }
  editEmployee(employeeId: number) {
    this.router.navigate([`employees/edit/${employeeId}`]);
  }
  deleteEmployee(employeeId: any) {
    this.employeesService.deleteEmployee(employeeId).subscribe(() => {
      this.getEmployees(); // Refresh the employee list
    }, error => {
      console.error('Error deleting employee', error);
    });
  }
  
  navigate(route: string) {
    this.router.navigate([route]);
  }
  //date and time formatting fix
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Adjust the locale format as needed
  }
  
  formatTime(timeString: string): string {
    const time = new Date(timeString);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
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