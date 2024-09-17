import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IHoliday } from '../../models/iHoliday';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { OfficialHolidaysService } from '../../services/official-holidays/official-holidays.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-official-holidays',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    BreadcrumbsComponent
  ],
  templateUrl: './official-holidays.component.html',
  styleUrls: ['./official-holidays.component.scss']
})

export class OfficialHolidaysComponent implements OnInit, AfterViewInit {
  holidayForm: FormGroup;
  holidays: IHoliday[] = [];
  displayedColumns: string[] = ['name', 'date', 'actions'];
  dataSource = new MatTableDataSource<IHoliday>(this.holidays);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private holidaysService: OfficialHolidaysService
  ) {
    this.holidayForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      type: ['holiday']  // Default to 'holiday'
    });
  }

  ngOnInit(): void {
    this.loadHolidays();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadHolidays(): void {
    this.holidaysService.getHolidays().subscribe({
      next: (response: any) => {
        if (response && response.data && Array.isArray(response.data)) {
          this.holidays = response.data
            .map((holiday: any) => ({
              id: holiday.id,
              name: holiday.description,
              date: holiday.date,
              type: holiday.off_day_types.length ? holiday.off_day_types[0].name : 'holiday' // Default to 'holiday'
            }))
            .filter((holiday: IHoliday) => holiday.type === 'holiday'); // Filter by type
          this.dataSource.data = this.holidays;
        } else {
          console.error('Unexpected response format:', response);
        }
      },
      error: (error: any) => {
        console.error('Failed to load holidays:', error);
      },
      complete: () => {
        console.log('Completed loading holidays');
      }
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addHoliday(): void {
    if (this.holidayForm.invalid) {
      this.holidayForm.markAllAsTouched();
      return;
    }

    const formValues = this.holidayForm.value;
    const newHoliday: IHoliday = {
      id: this.generateId(), // Generate a unique ID
      name: formValues.name,
      date: formValues.date,
      type: formValues.type // Include type from form
    };

    this.holidaysService.addHoliday(newHoliday).subscribe({
      next: (holiday: IHoliday) => {
        if (holiday.type === 'holiday') { // Only add to the list if type is 'holiday'
          this.holidays.push(holiday);
          this.dataSource.data = this.holidays;
          this.holidayForm.reset();
          this.snackBar.open('Holiday added successfully!', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('Only holidays can be added to this list.', 'Close', { duration: 3000 });
        }
      },
      error: (error: any) => {
        this.snackBar.open('Failed to add holiday', 'Close', { duration: 3000 });
      }
    });
  }

  editHoliday(holiday: IHoliday): void {
    this.holidayForm.patchValue({
      name: holiday.name,
      date: holiday.date,
      type: holiday.type // Include type for editing
    });
  }

  updateHoliday(holidayId: string): void {
    if (this.holidayForm.invalid) {
      this.holidayForm.markAllAsTouched();
      return;
    }

    const updatedHoliday: IHoliday = this.holidayForm.value;

    this.holidaysService.updateHoliday(holidayId, updatedHoliday).subscribe({
      next: (holiday: IHoliday) => {
        const index = this.holidays.findIndex(h => h.id === holidayId);
        if (index > -1) {
          this.holidays[index] = holiday;
          this.dataSource.data = this.holidays;
          this.snackBar.open('Holiday updated successfully!', 'Close', { duration: 3000 });
        }
      },
      error: (error: any) => {
        this.snackBar.open('Failed to update holiday', 'Close', { duration: 3000 });
      }
    });
  }

  deleteHoliday(holidayId: string): void {
    this.holidaysService.deleteHoliday(holidayId).subscribe({
      next: () => {
        const index = this.holidays.findIndex(h => h.id === holidayId);
        if (index > -1) {
          this.holidays.splice(index, 1);
          this.dataSource.data = this.holidays;
          this.snackBar.open('Holiday deleted successfully!', 'Close', { duration: 3000 });
        }
      },
      error: (error: any) => {
        this.snackBar.open('Failed to delete holiday', 'Close', { duration: 3000 });
      }
    });
  }

  private generateId(): string {
    return (Math.random() * 1000000).toFixed(0);
  }
}
