import { AttendanceService } from './../../services/attendance/attendance.service';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { Router, RouterOutlet } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';

export interface UserData {
  id: number;
  employee_name: string;
  employee_id: number;
  department: string;
  arrival_time: Date;
  leave_time: Date;
  date: Date;
}

@Component({
  selector: 'app-attendance-reports',
  standalone: true,
  imports: [
    BreadcrumbsComponent,
    MatButton,
    MatDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    MatExpansionModule,
    MatIconModule,
    RouterOutlet,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  templateUrl: './attendance-reports.component.html',
  styleUrl: './attendance-reports.component.scss',
  providers: [provideNativeDateAdapter(), DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceReportsComponent {
  displayedColumns: string[] = [
    'id',
    'name',
    'department',
    'arrival',
    'leave',
    'date',
    'actions',
  ];
  dataSource = new MatTableDataSource<UserData>([]);
  filteredDataSource = new MatTableDataSource<UserData>([]);

  isUpdated: boolean = false;
  updateArrival: Date = new Date();
  updateLeave: Date = new Date();
  updatedUserId: any;

  startDate: Date | null = null;
  endDate: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private attendanceService: AttendanceService
  ) {
    this.getAttendanceApi();
  }

  getAttendanceApi() {
    this.attendanceService.getAttendances().subscribe({
      next: (response) => {
        console.log(response);

        const formattedData = response.data.map((item: any) => ({
          id: item.id,
          name: item.employee_name,
          employee_id: item.employee_id,
          department: item.department,
          arrival_time: this.getTimeFromDate(item.arrival_time), // Assuming arrival is a string in response
          leave_time: this.getTimeFromDate(item.leave_time), // Assuming leave is a string in response
          date: new Date(item.date).toDateString(), // Convert date string to Date object
        }));

        this.dataSource.data = formattedData;
        this.filteredDataSource.data = formattedData;
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.applyDateFilter();
  }

  getTimeFromDate(dateString: string): string {
    const date = new Date(dateString);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  isAddNewAttendancesRoute(): boolean {
    return this.router.url === '/attendance-reports';
  }

  ngAfterViewInit() {
    this.filteredDataSource.paginator = this.paginator;
    this.filteredDataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();

    if (this.filteredDataSource.paginator) {
      this.filteredDataSource.paginator.firstPage();
    }
  }

  applyDateFilter() {
    this.filteredDataSource.data = this.dataSource.data;

    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      const filteredData = this.dataSource.data.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= start && itemDate <= end;
      });

      this.filteredDataSource.data = filteredData;
    } else {
      this.filteredDataSource.data = this.dataSource.data;
    }
  }

  editUser(id: number) {
    this.isUpdated = true;
    this.updatedUserId = id;
  }

  updateRecord(
    id: number,
    name: string,
    department: string,
    date: Date,
    employee_id: number
  ) {
    if (this.updateArrival && this.updateLeave) {
      const updateAttendance = {
        id: id,
        employee_name: name,
        employee_id: employee_id,
        department: department,
        arrival_time: this.updateArrival,
        leave_time: this.updateLeave,
        date: date,
      };
      this.attendanceService.updateAttendance(id, updateAttendance).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        },
      });
      this.dataSource.data = this.dataSource.data.filter((emp) => emp.id != id);
      this.dataSource.data.unshift(updateAttendance);
      this.filteredDataSource.data = this.dataSource.data;
      this.isUpdated = false;
    } else {
      console.log('failds are required');
    }
  }

  closeUpdate() {
    this.isUpdated = false;
  }

  deleteUser(element: UserData) {
    this.attendanceService.deleteAttendance(element.id).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.filteredDataSource.data = this.filteredDataSource.data.filter(
      (emp) => emp.id != element.id
    );
  }
}
