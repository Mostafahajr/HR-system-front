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
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private rulesService: VacationDaysService, private router: Router, private snackBar: MatSnackBar ) {
    this.weekendForm = new FormGroup({
      weekend1: new FormControl({ value: '', disabled: true }, [Validators.required]),
      weekend2: new FormControl({ value: '', disabled: true }, [Validators.required])
    });
  }

  ngOnInit(): void {
    this.loadWeekendDays();
  }

    loadWeekendDays(): void {
    this.rulesService.getVacationDays().subscribe({
      next: (response: any) => {
        
        console.log('Fetched vacation days response:', response);
  
      
        if (Array.isArray(response)) {
          this.vacationDays = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          
          this.vacationDays = response.data;
        } else {
          
          console.error('Vacation days data is not an array:', response);
          this.vacationDays = [];
        }
  
    
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
      if (this.weekendForm.value.weekend1 == this.weekendForm.value.weekend2) {
        return this.showToast(" Weekend 1 and Weekend 2 cannot be the same.")
      }
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
          this.showToast('Weekend days updated successfully!'); // Show success toast
          this.toggleEdit(); 
          this.router.navigate(['/weekend-settings']);
        },
        error: (error) => {
          console.error('Error updating weekend days:', error);
            //toast
          this.showToast('Failed to update weekend days.'); // Show error toast
        }
      });
    } else {
      console.warn('Form is invalid');
      //toast
      this.showToast('Please fill in all required fields.'); // Show validation error toast
    }
  }

  // Function for Toast
  showToast(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar'] 
    });
  }
    
}
