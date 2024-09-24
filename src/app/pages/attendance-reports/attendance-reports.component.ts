import { MatExpansionModule } from '@angular/material/expansion';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AttendanceService } from './../../services/attendance/attendance.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { provideNativeDateAdapter } from '@angular/material/core';

export interface UserData {
  id: number;
  employee_name: string;
  employee_id: number;
  department: string;
  arrival_time: string;
  leave_time: string;
  date: string;
  original_arrival_time: string;
  original_leave_time: string;
}

@Component({
  selector: 'app-attendance-reports',
  templateUrl: './attendance-reports.component.html',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    RouterOutlet,
    CommonModule,
    BreadcrumbsComponent,
    MatButtonModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatNativeDateModule,
    
  ],
  styleUrls: ['./attendance-reports.component.scss'],
  providers: [DatePipe,provideNativeDateAdapter()]
})
export class AttendanceReportsComponent implements OnInit {
  displayedColumns: string[] = [
    'employee_name',
    'department',
    'arrival',
    'leave',
    'date',
    'actions',
  ];
  dataSource = new MatTableDataSource<UserData>([]);
  filteredDataSource = new MatTableDataSource<UserData>([]);

  isUpdated: boolean = false;
  updateArrival: string = '';
  updateLeave: string = '';
  updatedUserId: number | null = null;

  startDate: Date | null = null;
  endDate: Date | null = null;
  nameFilter: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit() {
    this.getAttendanceApi();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.filteredDataSource.paginator = this.paginator;
    this.filteredDataSource.sort = this.sort;
  }

  getAttendanceApi() {
    this.attendanceService.getAttendances().subscribe({
      next: (response) => {
        const formattedData = response.data.map((item: any) => ({
          id: item.id,
          employee_name: item.employee_name,
          employee_id: item.employee_id,
          department: item.department,
          arrival_time: this.formatTimeForDisplay(item.arrival_time),
          leave_time: this.formatTimeForDisplay(item.leave_time),
          date: this.formatDate(new Date(item.date)),
          original_arrival_time: item.arrival_time,
          original_leave_time: item.leave_time,
        }));

        this.dataSource.data = formattedData;
        this.filteredDataSource.data = formattedData;
        this.applyFilters();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  isAddNewAttendancesRoute(): boolean {
    // Check if the current route is "attendance-reports"
    return this.router.url === '/attendance-reports';
  }

  applyFilter(event: Event) {
    // Filters table rows based on the input value for employee name
    this.nameFilter = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.applyFilters();
  }

  applyDateFilter() {
    // Filters table rows based on selected start and end dates
    this.applyFilters();
  }

  applyFilters() {
    const start = this.startDate ? new Date(this.startDate) : null;
    const end = this.endDate ? new Date(this.endDate) : null;

    this.filteredDataSource.data = this.dataSource.data.filter((item) => {
      const itemDate = new Date(item.date);
      const matchesDate =
        (!start || itemDate >= start) && (!end || itemDate <= end);
      const matchesName = this.nameFilter
        ? item.employee_name.toLowerCase().includes(this.nameFilter)
        : true;
      return matchesDate && matchesName;
    });
  }

  formatTimeForDisplay(isoString: string): string {
    const date = new Date(isoString); // ISO string from the server in UTC

    // Convert the date from UTC to Africa/Cairo time zone
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Africa/Cairo', // Set to Africa/Cairo explicitly
    });
  }

  formatTimeForEdit(isoString: string): string {
    const date = new Date(isoString);
    return this.datePipe.transform(date, 'HH:mm') || '';
  }

  formatTimeForUpdate(time: string): string {
    const [hours, minutes] = time.split(':');
    const date = new Date();

    // Set the hours and minutes in the Africa/Cairo time zone
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    // Convert the local time to UTC for sending to the backend
    return new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString();
  }

  editUser(id: number) {
    this.isUpdated = true;
    this.updatedUserId = id;
    const record = this.dataSource.data.find((item) => item.id === id);
    if (record) {
      this.updateArrival = this.formatTimeForEdit(record.original_arrival_time);
      this.updateLeave = this.formatTimeForEdit(record.original_leave_time);
    }
  }

  updateRecord(
    id: number,
    name: string,
    department: string,
    date: string,
    employee_id: number
  ) {
    if (this.updateArrival && this.updateLeave) {
      const formattedArrivalTime = this.formatTimeForUpdate(this.updateArrival);
      const formattedLeaveTime = this.formatTimeForUpdate(this.updateLeave);
      const formattedDate = this.formatDate(new Date(date));

      const updateAttendance = {
        employee_id,
        arrival_time: formattedArrivalTime,
        leave_time: formattedLeaveTime,
        date: formattedDate,
      };

      this.attendanceService.updateAttendance(id, updateAttendance).subscribe({
        next: () => {
          const updatedRecord: UserData = {
            id,
            employee_name: name,
            employee_id,
            department,
            arrival_time: this.formatTimeForDisplay(formattedArrivalTime),
            leave_time: this.formatTimeForDisplay(formattedLeaveTime),
            date: formattedDate,
            original_arrival_time: formattedArrivalTime,
            original_leave_time: formattedLeaveTime,
          };

          const index = this.dataSource.data.findIndex(
            (item) => item.id === id
          );
          if (index !== -1) {
            this.dataSource.data[index] = updatedRecord;
          }

          this.applyFilters();
          this.isUpdated = false;
          this.updatedUserId = null;
        },
        error: (error) => {
          console.error('Error updating attendance:', error);
        },
      });
    }
  }

  formatDate(date: Date): string {
    // Convert the date dynamically to Africa/Cairo time zone
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'Africa/Cairo', // Set to Africa/Cairo explicitly
    });
  }

  closeUpdate() {
    this.isUpdated = false;
    this.updatedUserId = null;
  }

  deleteUser(element: UserData) {
    this.attendanceService.deleteAttendance(element.id).subscribe({
      next: () => {
        this.filteredDataSource.data = this.filteredDataSource.data.filter(
          (emp) => emp.id !== element.id
        );
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  printReport() {
    const startDateFormatted = this.startDate
      ? this.datePipe.transform(this.startDate, 'yyyy-MM-dd')
      : 'No Start Date';
    const endDateFormatted = this.endDate
      ? this.datePipe.transform(this.endDate, 'yyyy-MM-dd')
      : 'No End Date';
    const nameFilterFormatted = this.nameFilter
      ? `Filtered by: ${this.nameFilter}`
      : 'No Name Filter';

    const title = `Attendance Records from ${startDateFormatted} to ${endDateFormatted}`;
    const subTitle = nameFilterFormatted;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Attendance Report</title>
            <style>
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid black; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            <h2>${subTitle}</h2>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Arrival</th>
                  <th>Leave</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                ${this.filteredDataSource.data
                  .map(
                    (row, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${row.employee_name}</td>
                    <td>${row.department}</td>
                    <td>${row.arrival_time}</td>
                    <td>${row.leave_time}</td>
                    <td>${row.date}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
        // Optional: Close the window after printing
        // printWindow.close();
      };
    } else {
      console.error('Unable to open print window');
    }
  }

  generatePDF() {
    const doc = new jsPDF();

    const startDateFormatted = this.startDate
      ? this.datePipe.transform(this.startDate, 'yyyy-MM-dd')
      : 'No Start Date';
    const endDateFormatted = this.endDate
      ? this.datePipe.transform(this.endDate, 'yyyy-MM-dd')
      : 'No End Date';
    const nameFilterFormatted = this.nameFilter
      ? `Filtered by: ${this.nameFilter}`
      : 'No Name Filter';

    const title = `Attendance Records from ${startDateFormatted} to ${endDateFormatted}`;
    const subTitle = nameFilterFormatted;

    const columns = ['No', 'Name', 'Department', 'Arrival', 'Leave', 'Date'];
    const rows = this.filteredDataSource.data.map((row, index) => [
      index + 1,
      row.employee_name,
      row.department,
      row.arrival_time,
      row.leave_time,
      row.date,
    ]);

    doc.setFontSize(20);
    doc.text(title, 14, 20);
    doc.setFontSize(12);
    doc.text(subTitle, 14, 30);

    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 40,
    });

    const nameFilterSafe = this.nameFilter
      ? this.nameFilter.replace(/[^a-zA-Z0-9]/g, '_')
      : 'no_name_filter';
    const fileName = `attendance_records_${startDateFormatted}_to_${endDateFormatted}_filtered_by_${nameFilterSafe}.pdf`;

    doc.save(fileName);
  }
}
