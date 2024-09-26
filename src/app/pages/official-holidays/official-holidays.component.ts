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
    MatButton
  ],
  templateUrl: './official-holidays.component.html',
  styleUrls: ['./official-holidays.component.scss']
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
      date: ['', Validators.required]
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
          this.holidays = response.data.map((holiday: any) => ({
            id: holiday.id,
            name: holiday.description,
            description: holiday.description,
            date: new Date(holiday.date),  // Convert to Date
            type: holiday.off_day_types.length ? holiday.off_day_types[0].name : 'holiday', // Safeguard against empty off_day_types
          }));
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
    console.log('Form values:', formValues);
  
    let formattedDate: string;
    if (formValues.date instanceof Date) {
      // Format the date in local timezone
      formattedDate = `${formValues.date.getFullYear()}-${String(formValues.date.getMonth() + 1).padStart(2, '0')}-${String(formValues.date.getDate()).padStart(2, '0')}`;
    } else {
      formattedDate = formValues.date;
    }
  
    const holidayData: IHoliday = {
      id: this.selectedHolidayId || this.generateId(),
      name: formValues.name,
      description: formValues.name,
      date: formattedDate,
    };
  
    console.log('Holiday data before sending:', holidayData);
  
    if (this.selectedHolidayId) {
      this.updateHoliday(holidayData);
    } else {
      this.addHoliday(holidayData);
    }
  }
  
  
  updateHoliday(holidayData: IHoliday): void {
    this.holidaysService.updateHoliday(this.selectedHolidayId!, holidayData).subscribe({
      next: (response: any) => {
        // Ensure we are getting the correct updated data
        const updatedHoliday = response.data;
  
        const index = this.holidays.findIndex(h => h.id === this.selectedHolidayId);
        if (index > -1) {
          // Update only the necessary fields
          const updatedHolidayObject: IHoliday = {
            id: updatedHoliday.id || this.holidays[index].id,  // Retain the ID
            name: updatedHoliday.description || this.holidays[index].name,  // Retain original name if not provided
            description: updatedHoliday.description || this.holidays[index].description,  // Retain original description if not provided
            date: updatedHoliday.date ? new Date(updatedHoliday.date).toISOString().split('T')[0] : this.holidays[index].date // Retain original date if not provided
          };
          
          // Replace the updated object in the holidays array
          this.holidays[index] = updatedHolidayObject;
  
          // Update the table data source
          this.dataSource.data = [...this.holidays];
  
          // Reset the form after updating
          this.resetForm();
          this.snackBar.open('Holiday updated successfully!', 'Close', { duration: 3000 });
        }
      },
      error: (error: any) => {
        console.error('Error updating holiday:', error);
        this.snackBar.open('Failed to update holiday', 'Close', { duration: 3000 });
      }
    });
  }
  

  addHoliday(holidayData: IHoliday): void {
    console.log('Sending holiday data:', holidayData);
  
    this.holidaysService.addHoliday(holidayData).subscribe({
      next: (response: any) => {
        console.log('Response from server:', response);
        const newHoliday: IHoliday = {
          id: response.data.id,
          name: response.data.description,
          description: response.data.description,
          date: holidayData.date,
        };
  
        this.holidays.push(newHoliday);
        this.dataSource.data = [...this.holidays];
        this.resetForm();
        this.snackBar.open('Holiday added successfully!', 'Close', { duration: 3000 });
      },
      error: (error: any) => {
        console.error('Error adding holiday:', error);
        this.snackBar.open('Failed to add holiday', 'Close', { duration: 3000 });
      }
    });
  }
  
  

  editHoliday(holiday: IHoliday): void {
    this.selectedHolidayId = holiday.id;
    this.holidayForm.patchValue({
      name: holiday.name,
      date: holiday.date
    });
  }

  deleteHoliday(holidayId: string): void {
    this.holidaysService.deleteHoliday(holidayId).subscribe({
      next: () => {
        this.holidays = this.holidays.filter(h => h.id !== holidayId);
        this.dataSource.data = [...this.holidays];
        this.snackBar.open('Holiday deleted successfully!', 'Close', { duration: 3000 });
      },
      error: (error: any) => {
        this.snackBar.open('Failed to delete holiday', 'Close', { duration: 3000 });
      }
    });
  }

  resetForm(): void {
    this.holidayForm.reset();  // Reset the form fields
    this.holidayForm.markAsPristine();  // Mark form as pristine
    this.holidayForm.markAsUntouched();  // Mark form as untouched
    this.holidayForm.updateValueAndValidity();  // Update the validation status
    this.selectedHolidayId = null;
  }
  
  

  private generateId(): string {
    return (Math.random() * 1000000).toFixed(0);
  }
}