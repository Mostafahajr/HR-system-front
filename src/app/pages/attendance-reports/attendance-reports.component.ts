import { MatSpinner } from '@angular/material/progress-spinner';
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
  providers: [DatePipe, provideNativeDateAdapter()]
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
  isLoading:boolean=true;
  startDate: Date | null = null;
  endDate: Date | null = null;
  nameFilter: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private attendanceService: AttendanceService,
    private snackBar: MatSnackBar
  ) { }

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
    this.isLoading=true;
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
        this.applyFilters();
        this.isLoading=false;
      },
      error: (error) => {
        console.error(error);
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
  showToast(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Toast will be visible for 3 seconds
      horizontalPosition: 'center', // 'start', 'center', 'end', 'left', or 'right'
      verticalPosition: 'bottom', // 'top' or 'bottom'
    });
  }
  
  editUser(id: number) {
    this.isUpdated = true;
    this.updatedUserId = id;
    const record = this.dataSource.data.find((item) => item.id === id);
    if (record) {
        // Check if the date is more than one month old
        if (this.isDateMoreThanOneMonthOld(record.date)) {
            alert('You cannot modify attendance records that are more than one month old.');
            this.isUpdated = false; 
            this.updatedUserId = null; 
            return; 
        }

        this.updateArrival = this.formatTimeForEditing(record.arrival_time); 
        this.updateLeave = this.formatTimeForEditing(record.leave_time);
        
        this.showToast('Attendance record is ready for editing.', 'Close');
    } else {
        // If no record is found, show an error toast
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
  
  // Function to format time for editing (local time display)
  formatTimeForEditing(timeString: string): string {
    const date = new Date(timeString); // Parse the incoming ISO date string
    const hours = String(date.getUTCHours()).padStart(2, '0'); // Pad hours to 2 digits
    const minutes = String(date.getUTCMinutes()).padStart(2, '0'); // Pad minutes to 2 digits
    return `${hours}:${minutes}`; // Return in HH:mm format
  }
  
  // Function to combine current date with given HH:mm time string and return a Date object
  // Function to combine current date with given HH:mm time string and return a Date object
extractTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();

  // Check if hours and minutes are valid numbers
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error(`Invalid time format: ${timeString}`);
  }

  // Set the hours and minutes to the local date's time
  date.setHours(hours, minutes, 0, 0);
  
  // Convert local time to UTC string before returning
  return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString(); 
}

  
  // Time formatting for displayed time in HTML
  formatTime(isoString: string): string {
    
    const date = new Date(isoString);
    const hours = date.getUTCHours(); // Using UTC hours
    const minutes = date.getUTCMinutes(); // Using UTC minutes
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
    const formattedMinutes = String(minutes).padStart(2, '0'); // Add leading zero for minutes if necessary
    return `${formattedHours}:${formattedMinutes} ${suffix}`;
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
  
          // Show toast notification for successful edit
          this.showToast('Attendance record updated successfully!', 'Close');
        },
        error: (error) => {
          console.error('Error updating attendance:', error);
        },
      });
    }
  }
  
  // Helper function to format time for the update (from HH:mm to a valid date-time string)
  formatTimeForUpdate(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
  
    // Check if hours and minutes are valid numbers
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      throw new Error(`Invalid time format: ${time}`);
    }
  
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    return date.toISOString(); // Or format as per your requirement
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
  
        // Show toast notification for successful deletion
        this.showToast('Attendance record deleted successfully!', 'Close');
      },
      error: (error) => {
        console.error('Error deleting attendance record:', error);
        this.showToast('Error deleting attendance record. Please try again.', 'Close');
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

  // updateRecord(
  //   id: number,
  //   name: string,
  //   department: string,
  //   date: string,
  //   employee_id: number
  // ) {
  //   if (this.updateArrival && this.updateLeave) {
  //     // Convert formatted time back to ISO string for saving
  //     const updateAttendance = {
  //       employee_id,
  //       arrival_time: this.extractTime(this.updateArrival), // Use extractTime for proper formatting
  //       leave_time: this.extractTime(this.updateLeave),
  //       date: date,
  //     };
  
  //     this.attendanceService.updateAttendance(id, updateAttendance).subscribe({
  //       next: () => {
  //         const updatedRecord: UserData = {
  //           id,
  //           employee_name: name,
  //           employee_id,
  //           department,
  //           arrival_time: updateAttendance.arrival_time, // Use updated arrival time
  //           leave_time: updateAttendance.leave_time, // Use updated leave time
  //           date: date,
  //         };
  
  //         const index = this.dataSource.data.findIndex(
  //           (item) => item.id === id
  //         );
  //         if (index !== -1) {
  //           this.dataSource.data[index] = updatedRecord; // Update the data source with the new record
  //         }
  
  //         this.applyFilters();
  //         this.isUpdated = false;
  //         this.updatedUserId = null;
  //       },
  //       error: (error) => {
  //         console.error('Error updating attendance:', error);
  //       },
  //     });
  //   }
  // }