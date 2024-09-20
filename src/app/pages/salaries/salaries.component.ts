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
    const doc = new jsPDF();

    // Add title with employee name
    doc.setFontSize(18);
    doc.text(`${element.name} Salary Report`, 14, 22);

    // Prepare data for the first table
    const firstTableData = [
      ['Name', element.name],
      ['Department', element.department.department_name],
      ['Salary', element.salary],
      ['Contract Arrival Time', this.formatTimeToHHMM(element.contract_arrival_time)],
      ['Contract Leave Time', this.formatTimeToHHMM(element.contract_leave_time)],
      ['Attended Days', element.attended_days],
      ['Absent Days', element.absent_days],
      ['Total Bonus Hours', this.formatMinutesToHHMM(element.total_bonus_minutes)],
      ['Total Penalty Hours', this.formatMinutesToHHMM(element.total_penalty_minutes)],
      ['Total Bonus EGP', this.roundNumber(element.total_bonus_egp)],
      ['Total Penalty EGP', this.roundNumber(element.total_penalty_egp)],
      ['Net Salary', this.roundNumber(element.net_salary)]
    ];

    // Add the first table with enhanced styles
    (doc as any).autoTable({
      startY: 32,
      head: [],
      body: firstTableData,
      theme: 'grid', // Use 'grid' theme for borders
      styles: {
        fontSize: 12,
        cellPadding: 2, // Tighter spaces
        textColor: [0, 0, 0],
        lineColor: [44, 62, 80],
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: 70 }, // Adjusted for longer labels
        1: { cellWidth: 100 },
      },
      didParseCell: function (data: any) {
        if (data.section === 'body') {
          if (data.column.index === 0) {
            // Left column (labels)
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [230, 230, 230]; // Light gray background
          }
        }
      }
    });

    // Keep track of the Y position after the first table
    const finalY = (doc as any).lastAutoTable.finalY || 32;

    // Add Daily Records title
    doc.setFontSize(14);
    doc.text('Daily Records', 14, finalY + 10);

    // Prepare data for the daily records table
    const tableColumn = ["Date", "Arrival Time", "Leave Time", "Bonus Hours", "Penalty Hours"];
    const tableRows = element.daily_records.map(record => [
      record.date,
      record.arrival_time || 'N/A',
      record.leave_time || 'N/A',
      this.formatMinutesToHHMM(record.bonus_minutes),
      this.formatMinutesToHHMM(record.penalty_minutes)
    ]);

    // Calculate totals
    const totalBonusMinutes = element.daily_records.reduce((sum, record) => sum + record.bonus_minutes, 0);
    const totalPenaltyMinutes = element.daily_records.reduce((sum, record) => sum + record.penalty_minutes, 0);

    // Add totals row
    tableRows.push([
      'Total',
      '', // Empty for Arrival Time
      '', // Empty for Leave Time
      this.formatMinutesToHHMM(totalBonusMinutes),
      this.formatMinutesToHHMM(totalPenaltyMinutes)
    ]);

    // Render the daily records table with enhanced styles
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: finalY + 16,
      theme: 'grid',
      styles: {
        fontSize: 12,
        cellPadding: 2,
        textColor: [0, 0, 0],
        lineColor: [44, 62, 80],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [41, 128, 185], // Header background color
        textColor: [255, 255, 255], // Header text color
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245], // Alternate row background color
      },
      // Remove columnStyles to let autoTable adjust column widths automatically
      // columnStyles: {},
      tableWidth: 'auto', // Optional, 'auto' is the default
    });

    // Instead of saving, output the PDF as a blob
    const pdfOutput = doc.output('blob');

    // Create a URL for the blob
    const pdfUrl = URL.createObjectURL(pdfOutput);

    // Open the PDF in a new tab
    window.open(pdfUrl, '_blank');

    // Optionally, you can revoke the URL after a delay to free up memory
    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
    }, 100);
  }
}