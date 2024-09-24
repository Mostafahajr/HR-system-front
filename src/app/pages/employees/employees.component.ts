import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { EmployeesService } from '../../services/employees/employees.service';
import { Subscription } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Import MatSnackBar
import { MatProgressSpinner, MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    BreadcrumbsComponent,
    ReactiveFormsModule,
    MatButtonModule,
    RouterOutlet,
    MatTableModule,
    CommonModule,
    MatPaginatorModule,
    MatIconModule,
    RouterLink,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinner,
    // Add MatSnackBarModule
  ],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  loading: boolean = true;
  employees: any[] = [];
  showForm = false;
  selectedEmployee: any = null;
  displayedColumns: string[] = ['name', 'department', 'phone_number', 'salary', 'arrival_time', 'leave_time', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  departmentFilter = new FormControl('');
  nameFilter = new FormControl('');

  departments: string[] = [];
  private routerSubscription: Subscription;

  constructor(
    private employeesService: EmployeesService,
    private router: Router,
    private snackBar: MatSnackBar // Inject MatSnackBar here
  ) {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url === '/employees') {
          this.getEmployees();
        }
      }
    });
  }

  ngOnInit(): void {
    this.getEmployees();
    this.setupFilters();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  getEmployees(): void {
    this.employeesService.getAllEmployees().subscribe(
      (response) => {
        this.employees = response.data.map((employee: any) => ({
          ...employee,
          department_name: employee.department ? employee.department.name : 'N/A',
        }));
        this.dataSource.data = this.employees;
        this.extractDepartments();
        // Reassign the paginator after updating the data source
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error('Error fetching employee data', error);
      }
    );
  }

  setupFilters(): void {
    this.departmentFilter.valueChanges.subscribe(() => this.applyFilters());
    this.nameFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const departmentMatch = !this.departmentFilter.value || data.department_name.toLowerCase().includes(this.departmentFilter.value.toLowerCase());
      const nameMatch = !this.nameFilter.value || data.name.toLowerCase().includes(this.nameFilter.value.toLowerCase());
      return departmentMatch && nameMatch;
    };
    this.dataSource.filter = Math.random().toString(); // Trigger filter
  }

  extractDepartments(): void {
    this.departments = [...new Set(this.employees.map((e) => e.department_name))];
  }

  showDetails(employeeId: number): void {
    this.router.navigate([`employees/show/${employeeId}`]);
  }

  editEmployee(employeeId: number) {
    this.router.navigate([`employees/edit/${employeeId}`]);
  }

  deleteEmployee(employeeId: any) {
    this.employeesService.deleteEmployee(employeeId).subscribe(
      () => {
        this.getEmployees(); // Refresh the employee list

        // Show success toast
        this.showToast('Employee deleted successfully'); // Show success toast
      },
      (error) => {
        console.error('Error deleting employee', error);

        // Show error toast
        this.showToast('Error of deleting employee '); // Show success toast

      }
    );
  }
  showToast(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar'] // You can style this in your CSS
    });
  }
    
  navigate(route: string) {
    this.router.navigate([route]);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Adjust the locale format as needed
  }

  formatTime(timeString: string): string {
    const time = new Date(timeString);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  isAddNewEmployeeRoute() {
    return this.router.url === '/employees';
  }
}
