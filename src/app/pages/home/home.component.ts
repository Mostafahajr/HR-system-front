import { HomeService } from './../../services/home/home.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { AddNewGroupComponent } from '../add-new-group/add-new-group.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DataSource } from '@angular/cdk/collections';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BreadcrumbsComponent, AddNewGroupComponent, CommonModule, MatCardModule, MatTableModule, MatProgressSpinnerModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['name', 'department', 'salary'];
  departmentColumns: string[] = ['name', 'employeeCount'];
  title: string = 'Home';
 
  employeeData: any = null;
  holidayData: any = null;
  salaryData: any = null;
  departmentData: any = null;
 
  employeeLoading: boolean = true;
  holidayLoading: boolean = true;
  salaryLoading: boolean = true;
  departmentLoading: boolean = true;

  constructor(private homeService: HomeService) {}

  ngOnInit() {
    this.getEmployeeData();
    this.getHolidayData();
    this.getSalaryData();
    this.getDepartmentData();
  }

  getEmployeeData() {
    this.homeService.getEmployeeAttendance().subscribe({
      next: (data) => {
        this.employeeData = data;
        this.employeeLoading = false;
      },
      error: (error) => {
        console.error('Error fetching employee data:', error);
        this.employeeLoading = false;
      }
    });
  }

  getHolidayData() {
    this.homeService.getHolidays().subscribe({
      next: (data) => {
        this.holidayData = data;
        if (this.holidayData.upcomingHoliday && this.holidayData.upcomingHoliday.date) {
          this.holidayData.upcomingHoliday.date = new Date(this.holidayData.upcomingHoliday.date).toDateString();
        }
        this.holidayLoading = false;
      },
      error: (error) => {
        console.error('Error fetching holiday data:', error);
        this.holidayLoading = false;
      }
    });
  }

  getSalaryData() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    this.homeService.getSalaries(year, month).subscribe({
      next: (data) => {
        this.salaryData = data;
        this.salaryLoading = false;
      },
      error: (error) => {
        console.error('Error fetching salary data:', error);
        this.salaryLoading = false;
      }
    });
  }

  getDepartmentData() {
    this.homeService.getDepartmentInfo().subscribe({
      next: (data) => {
        this.departmentData = data;
        this.departmentLoading = false;
      },
      error: (error) => {
        console.error('Error fetching department data:', error);
        this.departmentLoading = false;
      }
    });
  }

  getRoundedAttendanceRate(): string {
    if (this.employeeData?.attendanceRate !== undefined) {
      // Convert to number and round to two decimal places
      const roundedRate = Math.round(parseFloat(this.employeeData.attendanceRate) * 100) / 100;
      return roundedRate.toFixed(2)+"%"; // Format as string with two decimal places
    }
    return "0.00"; // Return a default value if attendanceRate is undefined
  }
}