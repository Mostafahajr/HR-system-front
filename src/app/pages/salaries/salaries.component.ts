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

  constructor(private salaryReportsService: SalaryReportsService) { }

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
    this.salaryReportsService.getAllSalaries(this.selectedYear, this.selectedMonth)
      .subscribe(response => {
        this.dataSource.data = Object.values(response);
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


  printEmployeeSalaryPDF(element: SalaryData) {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('Employee Salary Report', 14, 22);

    // Add employee details
    doc.setFontSize(12);
    doc.text(`Name: ${element.name}`, 14, 32);
    doc.text(`Department: ${element.department.department_name}`, 14, 40);
    doc.text(`Salary: ${element.salary}`, 14, 48);
    doc.text(`Attended Days: ${element.attended_days}`, 14, 56);
    doc.text(`Absent Days: ${element.absent_days}`, 14, 64);
    doc.text(`Total Bonus Hours: ${this.roundNumber(element.total_bonus_minutes/60)}`, 14, 72);
    doc.text(`Total Penalty Hours: ${this.roundNumber(element.total_penalty_minutes/60)}`, 14, 80);
    doc.text(`Total Bonus EGP: ${this.roundNumber(element.total_bonus_egp)}`, 14, 88);
    doc.text(`Total Penalty EGP: ${this.roundNumber(element.total_penalty_egp)}`, 14, 96);
    doc.text(`Net Salary: ${this.roundNumber(element.net_salary)}`, 14, 104);

    // Add daily records table
    doc.setFontSize(14);
    doc.text('Daily Records', 14, 116);

    const tableColumn = ["Date", "Bonus Minutes", "Penalty Minutes"];
    const tableRows = element.daily_records.map(record => [
      record.date,
      record.bonus_minutes,
      record.penalty_minutes
    ]);

    // Calculate total bonus and penalty minutes
    const totalBonusMinutes = element.daily_records.reduce((sum, record) => sum + record.bonus_minutes, 0);
    const totalPenaltyMinutes = element.daily_records.reduce((sum, record) => sum + record.penalty_minutes, 0);

    // Add a row for totals at the end
    tableRows.push([
      'Total', // Label for total row
      totalBonusMinutes,
      totalPenaltyMinutes
    ]);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 120,
    });

    // Save the PDF
    doc.save(`${element.name}_salary_report.pdf`);
}


  //method to round to two decimal points
  roundNumber(value: number | undefined): string {
    return value ? value.toFixed(2) : '0.00';
  }

}