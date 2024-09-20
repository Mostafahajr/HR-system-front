import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeesService } from '../../services/employees/employees.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { Employee } from '../../models/iEmployee';


@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCard, MatCardHeader, MatCardContent, MatCardTitle, MatCardSubtitle, MatDivider, MatButton],
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'national_id',
    'phone_number',
    'arrival_time',
    'leave_time',
    'DOB',
    'nationality',
    'salary',
    'date_of_contract',
    'department'
  ];
  dataSource = new MatTableDataSource<Employee>();

  constructor(
    private route: ActivatedRoute,
    private employeesService: EmployeesService,
    private router: Router,
  ) { }
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
    this.employeesService.getEmployeeById(id).subscribe(
      (response: any) => {
        console.log('API Response:', response);

        // Check if department is present and map the response
        const employee = {
          ...response.data,
          department_name: response.data.department ? response.data.department.name : 'N/A'
        };

        // Set the single employee as the data source
        this.dataSource.data = [employee]; // Use array to match the MatTable's expected format
      },
      (error) => {
        console.error('Error fetching employee data', error);
      }
    );
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
  goBack(): void {
    this.router.navigate(['/employees']); // Navigate back to the employees list or previous route
  }
}