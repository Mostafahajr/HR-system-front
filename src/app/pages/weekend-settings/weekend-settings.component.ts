import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { VacationDaysService } from '../../services/vacation-days/vacation-days.service';
import { Router } from '@angular/router';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-weekend-settings',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatButton, ReactiveFormsModule, BreadcrumbsComponent],
  templateUrl: './weekend-settings.component.html',
  styleUrls: ['./weekend-settings.component.scss']
})
export class WeekendSettingsComponent implements OnInit {
  days: string[] = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  weekendForm: FormGroup;
  isEditable: boolean = false; // Flag to control whether the form is editable
  vacationDays: any[] = []; // Array to store vacation days

  constructor(private rulesService: VacationDaysService, private router: Router) {
    this.weekendForm = new FormGroup({
      weekend1: new FormControl({ value: '', disabled: true }, [Validators.required]),
      weekend2: new FormControl({ value: '', disabled: true }, [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadWeekendDays();
  }

  // Load the weekend days from the backend
  loadWeekendDays(): void {
    this.rulesService.getVacationDays().subscribe({
      next: (response: any) => {
        // Log the response data for debugging
        console.log('Fetched vacation days response:', response);
  
        // Check if response is an array
        if (Array.isArray(response)) {
          this.vacationDays = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          // Handle case where response contains a nested data array
          this.vacationDays = response.data;
        } else {
          // Fallback to empty array if the response format is unexpected
          console.error('Vacation days data is not an array:', response);
          this.vacationDays = [];
        }
  
        // Proceed with setting form values if there are enough entries
        if (this.vacationDays.length >= 2) {
          this.weekendForm.patchValue({
            weekend1: this.vacationDays[0]?.weekend_day || '',
            weekend2: this.vacationDays[1]?.weekend_day || ''
          });
        } else {
          console.error('Not enough vacation days entries found.');
        }
      },
      error: (error) => {
        console.error('Error fetching vacation days:', error);
      }
    });
  }
  

  // Toggle edit mode
  toggleEdit(): void {
    this.isEditable = !this.isEditable;
    if (this.isEditable) {
      this.weekendForm.controls['weekend1'].enable();
      this.weekendForm.controls['weekend2'].enable();
    } else {
      this.weekendForm.controls['weekend1'].disable();
      this.weekendForm.controls['weekend2'].disable();
    }
  }

  // Update the weekend days
  updateWeekendDays(): void {
    if (this.weekendForm.valid) {
      const updatedWeekendDays = [
        { id: this.vacationDays[0]?.id, weekend_day: this.weekendForm.value.weekend1 },
        { id: this.vacationDays[1]?.id, weekend_day: this.weekendForm.value.weekend2 }
      ];

      const updateRequests = updatedWeekendDays.map(day => 
        this.rulesService.updateVacationDay(day.id, { weekend_day: day.weekend_day })
      );

      forkJoin(updateRequests).subscribe({
        next: (responses) => {
          console.log('Successfully updated weekend days:', responses);
          // Optionally navigate away or show a success message
          this.router.navigate(['/weekend-settings']);
        },
        error: (error) => {
          console.error('Error updating weekend days:', error);
        }
      });
    } else {
      console.warn('Form is invalid');
    }
  }
}
