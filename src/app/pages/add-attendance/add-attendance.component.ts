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
  timeZoneOffset: number = new Date().getTimezoneOffset();

  constructor(
    private fb: FormBuilder,
    private addAttendanceService: AddAttendanceService,
    private cdr: ChangeDetectorRef,
    private departmentsService: DepartmentsService
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

      this.dataSource.data = excelData.map((item: any, index: number) => ({
        id: index + 1,
        department: item.departmentName,
        employee_name: item.employeeName,
        arrival_time: this.parseTime(item.date, item.attendance),
        leave_time: this.parseTime(item.date, item.departure),
        date: new Date(item.date),
      }));
      this.markAllRecordsForUpdate();
      this.cdr.markForCheck();
    } else {
      console.log('No Excel data passed.');
      this.onSearch();
    }
  }

  parseTime(date: string, time: string): Date | null {
    if (!time) return null;
    const [hours, minutes] = time.split(':').map(Number);
    const parsedDate = new Date(date);
    parsedDate.setHours(hours, minutes);
    return parsedDate;
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

    this.addAttendanceService
      .getAllAttendance(formattedDate, department)
      .subscribe({
        next: (data) => {
          console.log('Received data:', data);
          this.dataSource.data = data.map((record: any) => ({
            id: record.id,
            department: record.department_name,
            employee_name: record.employee_name,
            arrival_time: record.arrival_time
              ? this.adjustToLocalTime(new Date(record.arrival_time))
              : null,
            leave_time: record.leave_time
              ? this.adjustToLocalTime(new Date(record.leave_time))
              : null,
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
    const [hours, minutes] = input.value.split(':').map(Number);

    let newDate: Date | null = null;
    if (!isNaN(hours) && !isNaN(minutes)) {
      newDate = new Date(element.date);
      newDate.setHours(hours, minutes);
    }

    element[field] = newDate;
    this.updatedRecords.set(element.id, { ...element });
    this.cdr.markForCheck();
  }

  submitUpdates() {
    const updateObservables: Observable<any>[] = [];

    this.updatedRecords.forEach((record) => {
      const updatedArrivalTime = record.arrival_time
        ? this.adjustToUTC(record.arrival_time).toISOString()
        : null;
      const updatedLeaveTime = record.leave_time
        ? this.adjustToUTC(record.leave_time).toISOString()
        : null;

      const observable = this.addAttendanceService.updateAttendance(record.id, {
        arrival_time: updatedArrivalTime,
        leave_time: updatedLeaveTime,
      });

      updateObservables.push(observable);
    });

    if (updateObservables.length > 0) {
      forkJoin(updateObservables).subscribe({
        next: () => {
          console.log('All updates submitted successfully');
          this.updatedRecords.clear();
          this.onSearch();
          alert('Attendance updated successfully');
        },
        error: (err) => {
          console.error('Error occurred during update:', err);
        },
      });
    } else {
      console.log('No updates to submit');
    }
  }

  deleteAttendance(id: number) {
    this.addAttendanceService.deleteAttendance(id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(
          (record) => record.id !== id
        );
        this.updatedRecords.delete(id);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error deleting attendance:', err);
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

  formatTimeForDisplay(date: Date | null): string {
    if (!date) return '00:00';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  adjustToLocalTime(date: Date): Date {
    return new Date(date.getTime() - this.timeZoneOffset * 60000);
  }

  adjustToUTC(date: Date): Date {
    return new Date(date.getTime() + this.timeZoneOffset * 60000);
  }
}

interface AttendanceRecord {
  id: number;
  department: string;
  employee_name: string;
  arrival_time: Date | null;
  leave_time: Date | null;
  date: Date;
}
