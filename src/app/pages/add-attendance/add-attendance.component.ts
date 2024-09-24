import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Observable, forkJoin } from 'rxjs';
import { AddAttendanceService } from '../../services/add-attendance/add-attendance.service';
import { DepartmentsService } from '../../services/departments/departments.service';
import { Department } from '../../models/iDepartment';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import {
  MatDatepicker,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatOption } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-attendance',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    FormsModule,
    MatDatepickerToggle,
    ReactiveFormsModule,
    MatOption,
    CommonModule,
    MatPaginator,
    MatDatepicker,
    MatDatepickerModule,
    MatTable,
    MatInput,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  templateUrl: './add-attendance.component.html',
  styleUrls: ['./add-attendance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAttendanceComponent implements OnInit, AfterViewInit {
  filterForm: FormGroup;
  dataSource = new MatTableDataSource<AttendanceRecord>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'id',
    'department',
    'employee_name',
    'arrival_time',
    'leave_time',
    'date',
    'actions',
  ];

  departments: Department[] = [];
  updatedRecords: Map<number, AttendanceRecord> = new Map();

  constructor(
    private fb: FormBuilder,
    private addAttendanceService: AddAttendanceService,
    private cdr: ChangeDetectorRef,
    private departmentsService: DepartmentsService,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      date: [new Date()],
      department: [''],
    });
  }

  ngOnInit() {
    this.loadDepartments();
    this.handleExcelImport();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadDepartments() {
    this.departmentsService.getDepartments().subscribe({
      next: (response) => {
        this.departments = response.data;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading departments:', err);
      },
    });
  }

  handleExcelImport() {
    const excelData = history.state.data;
    if (excelData) {
        console.log('Excel Data:', excelData);
        const firstRecord = excelData[0];
        if (firstRecord) {
            this.filterForm.patchValue({
                date: new Date(firstRecord.date),
                department: firstRecord.departmentName || '',
            });
        }

        // Ensure proper mapping of the data
        this.dataSource.data = excelData.map((item: any, index: number) => ({
            id: index + 1,
            department: item.departmentName || '', // Map department name correctly
            employee_name: item.employeeName || '', // Map employee name correctly
            arrival_time: item.attendance || null, // Use correct property for attendance
            leave_time: item.departure || null, // Use correct property for departure
            date: new Date(item.date), // Correctly map date
        }));

        this.markAllRecordsForUpdate();
        this.cdr.markForCheck(); // Notify Angular to check for changes
    } else {
        console.log('No Excel data passed.');
        this.onSearch();
    }
}


  parseTime(time: string | null): string {
    if (!time) return ''; // Return an empty string if time is null
    
    const date = new Date(time);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  
    return `${hours}:${minutes}`; // Return as HH:MM format
  }
  
  


  markAllRecordsForUpdate() {
    this.dataSource.data.forEach((record) => {
      this.updatedRecords.set(record.id, { ...record });
    });
  }

  onSearch() {
    const { date, department } = this.filterForm.value;
    const formattedDate = this.formatDate(date);
  
    console.log('Searching with:', { formattedDate, department });
  
    this.addAttendanceService.getAllAttendance(formattedDate, department).subscribe({
      next: (data) => {
        console.log('Received data:', data);
        this.dataSource.data = data.map((record: any) => ({
          id: record.id,
          department: record.department_name,
          employee_name: record.employee_name,
          arrival_time: this.parseTime(record.arrival_time), // Use correct property
          leave_time: this.parseTime(record.leave_time), // Use correct property
          date: new Date(record.date),
        }));
        console.log('Mapped data:', this.dataSource.data);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error occurred:', err);
      },
    });
  }
  

  updateTime(
    element: AttendanceRecord,
    field: 'arrival_time' | 'leave_time',
    event: Event
  ) {
    const input = event.target as HTMLInputElement;
    const localTimeValue = input.value; // e.g., "12:00"
  
    // Update the field with the local time value directly
    if (localTimeValue) {
      element[field] = localTimeValue; // Store the time in HH:mm format
    } else {
      element[field] = null; // Set to null if the input is empty
    }
  
    this.updatedRecords.set(element.id, { ...element });
    this.cdr.markForCheck(); // Trigger change detection
  }
  
  
  

  showToast(
    message: string, 
    action: string = 'Close', 
    duration: number = 3000, 
    horizontalPosition: MatSnackBarHorizontalPosition = 'center', 
    verticalPosition: MatSnackBarVerticalPosition = 'bottom'
  ): void {
    this.snackBar.open(message, action, {
      duration: duration,
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition
    });
  }
  
  // Example Usage in submitUpdates
  submitUpdates() {
    const updateObservables: Observable<any>[] = [];
  
    this.updatedRecords.forEach((record) => {
      const observable = this.addAttendanceService.updateAttendance(record.id, {
        arrival_time: record.arrival_time,
        leave_time: record.leave_time,
      });
      updateObservables.push(observable);
    });
  
    if (updateObservables.length > 0) {
      forkJoin(updateObservables).subscribe({
        next: () => {
          this.showToast('Attendance updated successfully', 'Close', 3000, 'center', 'bottom');
          this.updatedRecords.clear();
          this.onSearch();
        },
        error: (err) => {
          console.error('Error occurred during update:', err);
          this.showToast('Failed to update attendance', 'Close', 3000, 'center', 'bottom');
        },
      });
    } else {
      this.showToast('No updates to submit', 'Close', 3000, 'center', 'bottom');
    }
  }
  
  deleteAttendance(id: number) {
    this.addAttendanceService.deleteAttendance(id).subscribe({
      next: () => {
        // Filter out the deleted record from the data source
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.id !== id
        );
        this.updatedRecords.delete(id);
        this.cdr.markForCheck();
  
        // Show success toast notification
        this.showToast('Attendance deleted successfully', 'Close', 3000, 'right', 'top');
      },
      error: (err) => {
        console.error('Error deleting attendance:', err);
  
        // Show error toast notification
        this.showToast('Failed to delete attendance', 'Close', 3000, 'right', 'top');
      },
    });
  }
  

  private formatDate(date: Date): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  formatTimeForDisplay(time: string | null): string {
  if (!time) return '00:00'; // Default value if time is not provided

  // Assuming time is in HH:MM format
  return time; // Return the time string directly or format it if needed
}


}

interface AttendanceRecord {
  id: number;
  department: string;
  employee_name: string;
  arrival_time: string | null;
  leave_time: string | null;
  date: Date;
}