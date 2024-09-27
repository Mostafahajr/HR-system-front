import { MatSpinner } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
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
import { MatSnackBar } from '@angular/material/snack-bar';

export interface UserData {
  id: number;
  employee_name: string;
  employee_id: number;
  department: string;
  arrival_time: string;
  leave_time: string;
  date: string;
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
    MatSpinner,
  ],
  styleUrls: ['./attendance-reports.component.scss'],
  providers: [DatePipe, provideNativeDateAdapter()],
})
export class AttendanceReportsComponent implements OnInit, AfterViewInit {
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
  isLoading: boolean = true;
  nameFilter: string = '';

  // Set default date range to last 30 days
  start: Date = new Date();
  end: Date = new Date();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private attendanceService: AttendanceService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getAttendanceApi();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.filteredDataSource.paginator = this.paginator;
    this.filteredDataSource.sort = this.sort;
    // Apply initial filters after view has been initialized
    this.applyFilters();
  }

  getAttendanceApi() {
    this.isLoading = true;
    this.attendanceService.getAttendances().subscribe({
      next: (response) => {
        const formattedData = response.data.map((item: any) => ({
          id: item.id,
          employee_name: item.employee_name,
          employee_id: item.employee_id,
          department: item.department,
          arrival_time: item.arrival_time,
          leave_time: item.leave_time,
          date: this.formatDate(new Date(item.date)),
        }));

        this.dataSource.data = formattedData;
        this.filteredDataSource.data = formattedData;
        this.isLoading = false;
        // Apply filters after data is loaded
        this.applyFilters();
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      },
    });
  }

  isAddNewAttendancesRoute(): boolean {
    return this.router.url === '/attendance-reports';
  }

  applyFilter(event: Event) {
    this.nameFilter = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.applyFilters();
  }

  applyDateFilter() {
    this.applyFilters();
  }

  applyFilters() {
    let start = this.start ? new Date(this.start.setHours(0, 0, 0, 0)) : null;
    let end = this.end ? new Date(this.end.setHours(23, 59, 59, 999)) : null;

    this.filteredDataSource.data = this.dataSource.data.filter((item) => {
      const itemDate = this.parseDate(item.date);

      const matchesDate =
        (!start || itemDate >= start) && (!end || itemDate <= end);
      const matchesName = this.nameFilter
        ? item.employee_name
            .toLowerCase()
            .includes(this.nameFilter.toLowerCase())
        : true;
      return matchesDate && matchesName;
    });

    // Trigger change detection
    this.filteredDataSource._updateChangeSubscription();
  }

  convertDateFormat(dateString: string): string {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  }

  parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed in JavaScript Date
  }

  formatTime(isoString: string): string {
    const date = new Date(isoString);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = String(minutes).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${suffix}`;
  }

  showToast(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  editUser(id: number) {
    this.isUpdated = true;
    this.updatedUserId = id;
    const record = this.dataSource.data.find((item) => item.id === id);
    if (record) {
      if (this.isDateMoreThanOneMonthOld(record.date)) {
        alert(
          'You cannot modify attendance records that are more than one month old.'
        );
        this.isUpdated = false;
        this.updatedUserId = null;
        return;
      }

      this.updateArrival = this.formatTimeForEditing(record.arrival_time);
      this.updateLeave = this.formatTimeForEditing(record.leave_time);

      this.showToast('Attendance record is ready for editing.', 'Close');
    } else {
      this.showToast('Attendance record not found.', 'Close');
    }
  }

  isDateMoreThanOneMonthOld(dateString: string): boolean {
    const recordDate = new Date(dateString);
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);
    return recordDate < oneMonthAgo;
  }

  formatTimeForEditing(timeString: string): string {
    const date = new Date(timeString);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  extractTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();

    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      throw new Error(`Invalid time format: ${timeString}`);
    }

    date.setHours(hours, minutes, 0, 0);

    return new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString();
  }

  updateRecord(
    id: number,
    name: string,
    department: string,
    date: string,
    employee_id: number
  ) {
    if (this.updateArrival && this.updateLeave) {
      const updateAttendance = {
        employee_id,
        arrival_time: this.extractTime(this.updateArrival),
        leave_time: this.extractTime(this.updateLeave),
        date: date,
      };

      this.attendanceService.updateAttendance(id, updateAttendance).subscribe({
        next: () => {
          const updatedRecord: UserData = {
            id,
            employee_name: name,
            employee_id,
            department,
            arrival_time: updateAttendance.arrival_time,
            leave_time: updateAttendance.leave_time,
            date: date,
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

          this.showToast('Attendance record updated successfully!', 'Close');
        },
        error: (error) => {
          console.error('Error updating attendance:', error);
        },
      });
    }
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy') || '';
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

        this.showToast('Attendance record deleted successfully!', 'Close');
      },
      error: (error) => {
        console.error('Error deleting attendance record:', error);
        this.showToast(
          'Error deleting attendance record. Please try again.',
          'Close'
        );
      },
    });
  }

  printReport() {
    const startDateFormatted = this.start
      ? this.formatDate(this.start)
      : 'No Start Date';
    const endDateFormatted = this.end
      ? this.formatDate(this.end)
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
                    <td>${this.formatTime(row.arrival_time)}</td>
                    <td>${this.formatTime(row.leave_time)}</td>
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
      };
    }
  }

  generatePDF() {
    const doc = new jsPDF();

    const startDateFormatted = this.start
      ? this.formatDate(this.start)
      : 'No Start Date';
    const endDateFormatted = this.end
      ? this.formatDate(this.end)
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
      this.formatTime(row.arrival_time),
      this.formatTime(row.leave_time),
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
