// attendance-reports.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AttendanceService } from '../../services/attendance/attendance.service';
import { Router, RouterOutlet } from '@angular/router';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';

interface EmployeeAttendance {
  id: number;
  arrival_time: string;
  leave_time: string;
  date: string;
  employee: {
    id: number;
    name: string;
    department: {
      id: number;
      department_name: string;
    };
  };
}

@Component({
  selector: 'app-attendance-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    BreadcrumbsComponent,
    RouterOutlet,
  ],
  templateUrl: './attendance-reports.component.html',
  styleUrls: ['./attendance-reports.component.scss'],
})
export class AttendanceReportsComponent implements OnInit {
  attendanceContainer: EmployeeAttendance[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'department',
    'date',
    'arrival_time',
    'leave_time',
    'actions',
  ];
  dataSource!: MatTableDataSource<EmployeeAttendance>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<EmployeeAttendance>([]);
    this.loadAttendances();
  }

  loadAttendances() {
    this.attendanceService.getAttendances().subscribe(
      (response: any) => {
        this.attendanceContainer = response.data;
        this.dataSource.data = this.attendanceContainer;
      },
      (error) => {
        console.error('Error fetching attendances:', error);
        // Handle error (e.g., show error message to user)
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onEdit(attendance: EmployeeAttendance) {
    console.log('Edit attendance:', attendance);
    // Implement edit logic here
    // For example: this.router.navigate(['/edit-attendance', attendance.id]);
  }

  onDelete(attendance: EmployeeAttendance) {
    console.log('Delete attendance:', attendance);
    // Implement delete logic here
    // For example:
    // this.attendanceService.deleteAttendance(attendance.id).subscribe(
    //   () => {
    //     this.loadAttendances(); // Reload data after deletion
    //   },
    //   (error) => {
    //     console.error('Error deleting attendance:', error);
    //     // Handle error (e.g., show error message to user)
    //   }
    // );
  }

  isAddNewAttendance(): boolean {
    return this.router.url === '/attendance-reports';
  }
}
