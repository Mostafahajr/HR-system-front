import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Observable, forkJoin } from 'rxjs';
import { AddAttendanceService } from '../../services/add-attendance/add-attendance.service';
import { ActivatedRoute  ,Router} from '@angular/router';

@Component({
  selector: 'app-add-attendance',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    NgxMatTimepickerModule,
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
  departments: string[] = [
    'Finance',
    'Human Resource',
    'Marketing',
    'Operations',
    'Sales',
    'IT Support',
    'Customer Service',
    'Research and Development',
    'Product Management',
  ];
  updatedRecords: Map<number, AttendanceRecord> = new Map();

  constructor(
    private fb: FormBuilder,
    private addAttendanceService: AddAttendanceService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    // private router: Router
  ) {
    this.filterForm = this.fb.group({
      date: [new Date()],
      department: [''],
    });
  }

  ngOnInit() {
    // Retrieve passed Excel data from the route state
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
        id: index + 1, // Serial ID starting from 1
        department: item.departmentName,
        employee_name: item.employeeName,
        arrival_time: item.attendance,
        leave_time: item.departure,
        date: item.date,
      }));
      this.cdr.markForCheck();
      
     
    } else {
      console.log('No Excel data passed.');
    }

    this.onSearch();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  private formatTimeToPicker(isoTime: string): string {
    if (!isoTime) return '';
    const date = new Date(isoTime);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  }

  private convertTimeToISO(time: string, date: string): string {
    const [hoursMinutes, period] = time.split(' ');
    let [hours, minutes] = hoursMinutes.split(':').map(Number);

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const dateObj = new Date(date);
    dateObj.setUTCHours(hours, minutes, 0, 0);
    return dateObj.toISOString();
  }

  onSearch() {
    const { date, department } = this.filterForm.value;
    const formattedDate = this.formatDate(date);

    this.addAttendanceService
      .getAllAttendance(formattedDate, department)
      .subscribe({
        next: (data) => {
          this.dataSource.data = data.map((record: any, index: number) => ({
            id: index + 1,
            ...record,
            arrival_time:
              this.formatTimeToPicker(record.arrival_time) || '9:00 AM',
            leave_time: this.formatTimeToPicker(record.leave_time) || '5:00 PM',
          }));
          this.updatedRecords.clear();
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
    event: any
  ) {
    let time: string;

    if (event && typeof event === 'string') {
      time = event;
    } else if (event && event.format) {
      time = event.format();
    } else {
      return;
    }

    if (time) {
      element[field] = time;
      this.updatedRecords.set(element.id, { ...element });
      this.cdr.markForCheck();
    }
  }

  submitUpdates() {
    const updateObservables: Observable<any>[] = [];

    this.updatedRecords.forEach((record) => {
      const updatedArrivalTime = this.convertTimeToISO(
        record.arrival_time,
        record.date
      );
      const updatedLeaveTime = this.convertTimeToISO(
        record.leave_time,
        record.date
      );

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
    this.addAttendanceService.deleteAttendance(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(
        (record) => record.id !== id
      );
      this.updatedRecords.delete(id);
      this.cdr.detectChanges();
    });
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  }
}

interface AttendanceRecord {
  id: number;
  department: string;
  employee_name: string;
  arrival_time: string;
  leave_time: string;
  date: string;
}
