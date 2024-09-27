import { MatButton } from '@angular/material/button';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IHoliday } from '../../models/iHoliday';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { OfficialHolidaysService } from '../../services/official-holidays/official-holidays.service';
import { ReactiveFormsModule } from '@angular/forms';

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
    BreadcrumbsComponent,
    MatButton,
  ],
  templateUrl: './official-holidays.component.html',
  styleUrls: ['./official-holidays.component.scss'],
})
export class OfficialHolidaysComponent implements OnInit, AfterViewInit {
  holidayForm: FormGroup;
  holidays: IHoliday[] = [];
  displayedColumns: string[] = ['name', 'date', 'actions'];
  dataSource = new MatTableDataSource<IHoliday>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedHolidayId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private holidaysService: OfficialHolidaysService
  ) {
    this.holidayForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
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
          // Filter out holidays with description "Regular weekend days (Friday, Saturday)"
          this.holidays = response.data
            .filter((holiday: any) => {
              // Exclude holidays where off_day_types description matches "Regular weekend days (Friday, Saturday)"
              return !(
                holiday.off_day_types.length &&
                holiday.off_day_types[0].description === 'Regular weekend days (Friday, Saturday)'
              );
            })
            .map((holiday: any) => ({
              id: holiday.id,
              name: holiday.description,
              description: holiday.description,
              date: new Date(holiday.date), // Convert date string to Date object
              type: holiday.off_day_types.length ? holiday.off_day_types[0].name : 'holiday', // Safeguard against empty off_day_types
            }));

          // Assign filtered holidays to dataSource for displaying in the table
          this.dataSource.data = this.holidays;
        } else {
          console.error('Unexpected response format:', response);
        }
      },
      error: (error: any) => {
        console.error('Failed to load holidays:', error);
      }
    });
  }


  addOrUpdateHoliday(): void {
    if (this.holidayForm.invalid) {
      this.holidayForm.markAllAsTouched();
      return;
    }

    const formValues = this.holidayForm.value;
    const holidayData: IHoliday = {
      id: this.selectedHolidayId || this.generateId(),
      name: formValues.name,
      description: formValues.name,
      date: formValues.date, // Updated function
    };

    if (this.selectedHolidayId) {
      this.holidaysService
        .updateHoliday(this.selectedHolidayId, holidayData)
        .subscribe({
          next: (response: any) => {
            const updatedHoliday = response.data;
            const index = this.holidays.findIndex(
              (h) => h.id === updatedHoliday.id
            );
            if (index !== -1) {
              this.holidays[index] = {
                id: updatedHoliday.id,
                name: updatedHoliday.description,
                description: updatedHoliday.description,
                date: formValues.date, // Display in a normalized format
              };
              this.dataSource.data = [...this.holidays]; // Refresh dataSource with updated holidays
            }
            this.resetForm();
            this.snackBar.open('Holiday updated successfully!', 'Close', {
              duration: 3000,
            });
          },
          error: (error: any) => {
            this.snackBar.open('Failed to update holiday', 'Close', {
              duration: 3000,
            });
          },
        });
    } else {
      this.addHoliday(holidayData);
    }
  }

  updateHoliday(holidayData: IHoliday): void {
    this.holidaysService
      .updateHoliday(this.selectedHolidayId!, holidayData)
      .subscribe({
        next: (updatedHoliday: IHoliday) => {
          const index = this.holidays.findIndex(
            (h) => h.id === this.selectedHolidayId
          );
          if (index > -1) {
            this.holidays[index] = updatedHoliday;
            this.dataSource.data = [...this.holidays];
            this.resetForm();
            this.snackBar.open('Holiday updated successfully!', 'Close', {
              duration: 3000,
            });
          }
        },
        error: (error: any) => {
          this.snackBar.open('Failed to update holiday', 'Close', {
            duration: 3000,
          });
        },
      });
  }

  addHoliday(holidayData: IHoliday): void {
    this.holidaysService.addHoliday(holidayData).subscribe({
      next: (response: any) => {
        const newHoliday: IHoliday = {
          id: response.data.id,
          name: response.data.description, // Use the description as the name
          description: response.data.description,
          date: new Date(response.data.date).toISOString().split('T')[0], // Convert Date to string (YYYY-MM-DD)
        };

        this.holidays.push(newHoliday);
        this.dataSource.data = [...this.holidays];
        this.resetForm();
        this.snackBar.open('Holiday added successfully!', 'Close', {
          duration: 3000,
        });
      },
      error: (error: any) => {
        this.snackBar.open('Failed to add holiday', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  editHoliday(holiday: IHoliday): void {
    this.selectedHolidayId = holiday.id;
    this.holidayForm.patchValue({
      name: holiday.name,
      date: holiday.date,
    });
  }

  deleteHoliday(holidayId: string): void {
    this.holidaysService.deleteHoliday(holidayId).subscribe({
      next: () => {
        this.holidays = this.holidays.filter((h) => h.id !== holidayId);
        this.dataSource.data = [...this.holidays];
        this.snackBar.open('Holiday deleted successfully!', 'Close', {
          duration: 3000,
        });
      },
      error: (error: any) => {
        this.snackBar.open('Failed to delete holiday', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  resetForm(): void {
    this.holidayForm.reset(); // Reset the form fields
    this.holidayForm.markAsPristine(); // Mark form as pristine
    this.holidayForm.markAsUntouched(); // Mark form as untouched
    this.holidayForm.updateValueAndValidity(); // Update the validation status
    this.selectedHolidayId = null;
  }

  private generateId(): string {
    return (Math.random() * 1000000).toFixed(0);
  }
}
