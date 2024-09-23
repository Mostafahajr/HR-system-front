import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee, EmployeesService } from '../../services/employees/employees.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';


@Component({
  selector: 'app-show',
  templateUrl:'./show.component.html',
  standalone:true,
  imports:[CommonModule,MatTableModule,MatCard,MatCardHeader,MatCardContent,MatCardTitle,MatCardSubtitle,MatDivider],
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'national_id',
    'address',
    'gender',
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
    private employeesService: EmployeesService
  ) {}
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
          
          // Map the response to include the department name (if available)
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
    formatTimeToHHMMAMPM(dateString: string): string {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      
      return date.toLocaleTimeString('en-US', options);
    }
}