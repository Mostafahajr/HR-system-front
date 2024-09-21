import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { SalaryReportsService } from '../../services/salary-reports/salary-reports.service';
import { SalaryData } from '../../models/iSalary';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { EmployeesService } from '../../services/employees/employees.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-salaries',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbsComponent,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule
  ],
  templateUrl: './salaries.component.html',
  styleUrls: ['./salaries.component.scss']
})
export class SalariesComponent implements AfterViewInit {
  years: string[] = ['2020', '2021', '2022', '2023', '2024'];
  // generate an associative array that contains the code of each month (jan->01, dec->12)
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  months: { name: string, value: string }[] = this.monthNames.map((name, index) => ({
    name,
    value: (index + 1).toString().padStart(2, '0') // Pad with leading zero
  }));
  departments: string[] = [];

  selectedYear: string = '2024';
  selectedMonth: string = '08';
  selectedDepartment: string = '';
  searchTerm: string = '';

  displayedColumns: string[] = [
    'name', 'department', 'salary', 'attended', 'absent',
    'overtime', 'deductions', 'totalSurplus', 'totalDeductions', 'net', 'actions'
  ];
  dataSource = new MatTableDataSource<SalaryData>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private salaryReportsService: SalaryReportsService,
    private employeesService: EmployeesService
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.loadSalaries();
  }

  onSelectionChange(event: MatSelectChange): void {
    const value = event.value;

    if (event.source.id === 'month-select') {
      this.selectedMonth = value;
      this.loadSalaries();  // Load data when the month changes
    } else if (event.source.id === 'year-select') {
      this.selectedYear = value;
      this.loadSalaries();  // Load data when the year changes
    } else if (event.source.id === 'department-select') {
      this.selectedDepartment = value;
      this.applyFilter();  // Apply local filtering when the department changes
    }
  }


  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.applyFilter();
  }

  loadSalaries(): void {
    forkJoin({
      salariesResponse: this.salaryReportsService.getAllSalaries(this.selectedYear, this.selectedMonth),
      employeesResponse: this.employeesService.getAllEmployees()
    }).subscribe(({ salariesResponse, employeesResponse }) => {
      // Process salaries
      const dataArray: SalaryData[] = [];
      for (const [id, salaryData] of Object.entries(salariesResponse)) {
        (salaryData as any).id = Number(id);
        dataArray.push(salaryData as SalaryData);
      }
      this.dataSource.data = dataArray;

      // Create a map of employeeId to arrival and leave times
      const employeeTimesMap = new Map<number, { arrival_time: string; leave_time: string }>();
      employeesResponse.data.forEach((employee: { id: number; arrival_time: any; leave_time: any; }) => {
        employeeTimesMap.set(employee.id, {
          arrival_time: employee.arrival_time,
          leave_time: employee.leave_time
        });
      });

      // Merge the contract times into the salary data
      this.dataSource.data.forEach(salaryData => {
        const times = employeeTimesMap.get(salaryData.id);
        if (times) {
          salaryData.contract_arrival_time = times.arrival_time;
          salaryData.contract_leave_time = times.leave_time;
        } else {
          salaryData.contract_arrival_time = 'N/A';
          salaryData.contract_leave_time = 'N/A';
        }
      });

      // Continue with the rest of the code
      this.departments = [...new Set(this.dataSource.data.map(item => item.department.department_name))];
      this.applyFilter();
    });
  }


  applyFilter(): void {
    this.dataSource.filterPredicate = (data: SalaryData, filter: string) => {
      const [nameFilter, departmentFilter] = filter.split('|');
      const matchName = data.name.toLowerCase().includes(nameFilter);
      const matchDepartment = !departmentFilter || data.department.department_name.toLowerCase() === departmentFilter.toLowerCase();
      return matchName && matchDepartment;
    };
    const filterValue = `${this.searchTerm.toLowerCase()}|${this.selectedDepartment}`;
    this.dataSource.filter = filterValue;
  }

  //method to round to two decimal points
  roundNumber(value: number | undefined): string {
    return value ? value.toFixed(2) : '0.00';
  }
  //method for formatting bonus and overtime in HH:MM format
  formatMinutesToHHMM(totalMinutes: number | undefined): string {
    if (totalMinutes === undefined || totalMinutes === null) {
      return '00:00';
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  // Method to format time strings to HH:MM format
  formatTimeToHHMM(timeString: string | undefined | null): string {
    if (!timeString) {
      return 'N/A';
    }

    // Check if timeString contains 'T', indicating it's a datetime string
    if (timeString.includes('T')) {
      // Extract the time part after 'T'
      timeString = timeString.split('T')[1];
    }

    const timeParts = timeString.split(':');
    if (timeParts.length >= 2) {
      return `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}`;
    } else {
      return 'N/A';
    }
  }


  printEmployeeSalaryPDF(element: SalaryData) {
    // Open a new window for printing
    const printWindow = window.open('', '_blank');

    // Prepare the HTML content
    const htmlContent = `
      <html>
        <head>
          <title>${element.name} Salary Report</title>
          <style>
          body { font-family: Arial, sans-serif; }
          h1 { font-size: 20px; text-align: center; margin-bottom: 20px; }
          h2 { font-size: 16px; margin-top: 30px; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .employee-info td:first-child { 
            background-color: #f7f7f7; /* Slight gray for the first column */
            font-weight: bold; 
            width: 200px;
          }
          .daily-records th { 
            background-color: #f7f7f7; /* Slight gray for the header */
            font-weight: bold;
          }
          .daily-records td { background-color: #ffffff; }
          .total-row { font-weight: bold; background-color: #f2f2f2; }
        </style>
        </head>
        <body onload="window.print(); window.close()">
          <h1>${element.name} Salary Report</h1>
          <table class="employee-info">
            <tr><td>Name</td><td>${element.name}</td></tr>
            <tr><td>Department</td><td>${element.department.department_name}</td></tr>
            <tr><td>Salary</td><td>${element.salary}</td></tr>
            <tr><td>Contract Arrival Time</td><td>${this.formatTimeToHHMM(element.contract_arrival_time)}</td></tr>
            <tr><td>Contract Leave Time</td><td>${this.formatTimeToHHMM(element.contract_leave_time)}</td></tr>
            <tr><td>Attended Days</td><td>${element.attended_days}</td></tr>
            <tr><td>Absent Days</td><td>${element.absent_days}</td></tr>
            <tr><td>Total Bonus Hours</td><td>${this.formatMinutesToHHMM(element.total_bonus_minutes)}</td></tr>
            <tr><td>Total Penalty Hours</td><td>${this.formatMinutesToHHMM(element.total_penalty_minutes)}</td></tr>
            <tr><td>Total Bonus EGP</td><td>${this.roundNumber(element.total_bonus_egp)}</td></tr>
            <tr><td>Total Penalty EGP</td><td>${this.roundNumber(element.total_penalty_egp)}</td></tr>
            <tr><td>Net Salary</td><td>${this.roundNumber(element.net_salary)}</td></tr>
          </table>
         
          <h2>Daily Records</h2>
          <table class="daily-records">
            <thead>
              <tr>
                <th>Date</th>
                <th>Arrival Time</th>
                <th>Leave Time</th>
                <th>Bonus Hours</th>
                <th>Penalty Hours</th>
              </tr>
            </thead>
            <tbody>
              ${element.daily_records.map(record => `
                <tr>
                  <td>${record.date}</td>
                  <td>${record.arrival_time || 'N/A'}</td>
                  <td>${record.leave_time || 'N/A'}</td>
                  <td>${this.formatMinutesToHHMM(record.bonus_minutes)}</td>
                  <td>${this.formatMinutesToHHMM(record.penalty_minutes)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td>Total</td>
                <td></td>
                <td></td>
                <td>${this.formatMinutesToHHMM(element.daily_records.reduce((sum, record) => sum + record.bonus_minutes, 0))}</td>
                <td>${this.formatMinutesToHHMM(element.daily_records.reduce((sum, record) => sum + record.penalty_minutes, 0))}</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Write the HTML content to the new window
    printWindow?.document.write(htmlContent);
    printWindow?.document.close();
  }

}
