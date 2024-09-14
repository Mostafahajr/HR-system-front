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
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  departments: string[] = [
    'HR', 'Finance', 'Engineering', 'Marketing', 'Sales', 'IT', 'Support'
  ];

  selectedYear: string = '';
  selectedMonth: string = '';
  selectedDepartment: string = '';
  searchTerm: string = '';

  displayedColumns: string[] = [
    'name', 'department', 'salary', 'attended', 'absent',
    'overtime', 'deductions', 'totalSurplus', 'totalDeductions', 'net', 'actions'
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.applyFilter();
  }

  onSelectionChange(event: MatSelectChange): void {
    const value = event.value;
    if (event.source.id === 'month-select') {
      this.selectedMonth = value;
    } else if (event.source.id === 'year-select') {
      this.selectedYear = value;
    } else if (event.source.id === 'department-select') {
      this.selectedDepartment = value;
    }
    this.applyFilter();
  }

  onSearch(event: Event, filterType: string): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.applyFilter();
  }

  applyFilter(): void {
    this.dataSource.filterPredicate = (data: PeriodicElement, filter: string) => {
      const [nameFilter, departmentFilter, yearFilter, monthFilter] = filter.split('|');

      // Ensure exact matches for year and month
      const matchName = nameFilter ? data.name.toLowerCase().includes(nameFilter) : true;
      const matchDepartment = departmentFilter ? data.department.toLowerCase().includes(departmentFilter) : true;
      const matchYear = yearFilter ? data.year === yearFilter : true;
      const matchMonth = monthFilter ? data.month === monthFilter : true;

      return matchName && matchDepartment && matchYear && matchMonth;
    };

    // Construct the filter value with pipe separators
    const filterValue = `${this.searchTerm.toLowerCase()}|${this.selectedDepartment.toLowerCase()}|${this.selectedYear}|${this.selectedMonth}`;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewDetails(element: PeriodicElement): void {
    console.log('Viewing details for:', element);
  }

  editUser(element: PeriodicElement): void {
    console.log('Editing user:', element);
  }

  deleteUser(element: PeriodicElement): void {
    console.log('Deleting user:', element);
  }
}

export interface PeriodicElement {
  name: string;
  department: string;
  salary: number;
  attended: number;
  absent: number;
  overtime: number;
  deductions: number;
  totalSurplus: number;
  totalDeductions: number;
  net: number;
  year: string;
  month: string;
}







const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'John Doe', department: 'HR', salary: 5000, attended: 20, absent: 2, overtime: 5, deductions: 100, totalSurplus: 200, totalDeductions: 50, net: 5050, year: '2024', month: 'January'},
  {name: 'Jane Smith', department: 'Finance', salary: 6000, attended: 22, absent: 1, overtime: 6, deductions: 150, totalSurplus: 300, totalDeductions: 60, net: 5890, year: '2024', month: 'January'},
  {name: 'Robert Johnson', department: 'Engineering', salary: 7000, attended: 21, absent: 3, overtime: 8, deductions: 200, totalSurplus: 400, totalDeductions: 70, net: 7130, year: '2024', month: 'February'},
  {name: 'Emily Davis', department: 'Marketing', salary: 5500, attended: 20, absent: 0, overtime: 4, deductions: 120, totalSurplus: 250, totalDeductions: 40, net: 5690, year: '2024', month: 'February'},
  {name: 'Michael Brown', department: 'Sales', salary: 6500, attended: 23, absent: 1, overtime: 7, deductions: 180, totalSurplus: 350, totalDeductions: 65, net: 6855, year: '2024', month: 'March'},
  {name: 'Linda Garcia', department: 'IT', salary: 7500, attended: 25, absent: 2, overtime: 10, deductions: 250, totalSurplus: 500, totalDeductions: 80, net: 7470, year: '2024', month: 'March'},
  {name: 'David Wilson', department: 'Support', salary: 5200, attended: 19, absent: 3, overtime: 5, deductions: 90, totalSurplus: 200, totalDeductions: 45, net: 5365, year: '2024', month: 'April'},
  {name: 'Sarah Martinez', department: 'HR', salary: 4800, attended: 21, absent: 1, overtime: 3, deductions: 100, totalSurplus: 180, totalDeductions: 50, net: 4930, year: '2024', month: 'April'},
  {name: 'James Anderson', department: 'Finance', salary: 5600, attended: 20, absent: 2, overtime: 6, deductions: 130, totalSurplus: 220, totalDeductions: 55, net: 5640, year: '2024', month: 'May'},
  {name: 'Jessica Thomas', department: 'Engineering', salary: 7200, attended: 22, absent: 0, overtime: 8, deductions: 210, totalSurplus: 420, totalDeductions: 70, net: 7340, year: '2024', month: 'May'},
  {name: 'Daniel Taylor', department: 'Marketing', salary: 5300, attended: 19, absent: 2, overtime: 4, deductions: 110, totalSurplus: 190, totalDeductions: 45, net: 5145, year: '2024', month: 'June'},
  {name: 'Laura Moore', department: 'Sales', salary: 6000, attended: 23, absent: 1, overtime: 7, deductions: 160, totalSurplus: 310, totalDeductions: 60, net: 6190, year: '2024', month: 'June'},
  {name: 'Christopher Jackson', department: 'IT', salary: 7800, attended: 24, absent: 1, overtime: 9, deductions: 280, totalSurplus: 550, totalDeductions: 90, net: 7950, year: '2024', month: 'July'},
  {name: 'Amanda Harris', department: 'Support', salary: 4900, attended: 20, absent: 3, overtime: 4, deductions: 100, totalSurplus: 190, totalDeductions: 50, net: 4940, year: '2024', month: 'July'},
  {name: 'William Lewis', department: 'HR', salary: 4600, attended: 22, absent: 1, overtime: 5, deductions: 80, totalSurplus: 170, totalDeductions: 40, net: 4650, year: '2024', month: 'August'},
  {name: 'Olivia Robinson', department: 'Finance', salary: 5400, attended: 21, absent: 2, overtime: 6, deductions: 140, totalSurplus: 210, totalDeductions: 55, net: 5415, year: '2024', month: 'August'},
  {name: 'Ethan Clark', department: 'Engineering', salary: 7300, attended: 23, absent: 0, overtime: 9, deductions: 230, totalSurplus: 440, totalDeductions: 80, net: 7430, year: '2024', month: 'September'},
  {name: 'Sophia Walker', department: 'Marketing', salary: 5200, attended: 22, absent: 2, overtime: 5, deductions: 120, totalSurplus: 200, totalDeductions: 50, net: 5230, year: '2024', month: 'September'},
  {name: 'Andrew Hall', department: 'Sales', salary: 6400, attended: 24, absent: 0, overtime: 8, deductions: 170, totalSurplus: 330, totalDeductions: 65, net: 6595, year: '2024', month: 'October'},
  {name: 'Mia Allen', department: 'IT', salary: 7900, attended: 25, absent: 1, overtime: 10, deductions: 290, totalSurplus: 580, totalDeductions: 100, net: 7950, year: '2024', month: 'October'},
  {name: 'Alexander Young', department: 'Support', salary: 5100, attended: 20, absent: 2, overtime: 6, deductions: 110, totalSurplus: 200, totalDeductions: 55, net: 5145, year: '2024', month: 'November'},
  {name: 'Charlotte Hernandez', department: 'HR', salary: 4700, attended: 21, absent: 1, overtime: 4, deductions: 90, totalSurplus: 180, totalDeductions: 45, net: 4735, year: '2024', month: 'November'},
  {name: 'Jacob King', department: 'Finance', salary: 5500, attended: 22, absent: 2, overtime: 7, deductions: 150, totalSurplus: 220, totalDeductions: 60, net: 5510, year: '2024', month: 'December'},
  {name: 'Emily Wright', department: 'Engineering', salary: 7400, attended: 21, absent: 0, overtime: 8, deductions: 240, totalSurplus: 430, totalDeductions: 70, net: 7460, year: '2022', month: 'December'}
];
