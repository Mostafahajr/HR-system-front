import { BreadcrumbsComponent } from './../../components/breadcrumbs/breadcrumbs.component';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { GeneralRulesService } from './../../services/general-rules/general-rules.service';

@Component({
  selector: 'app-weekend-settings',
  standalone: true,
  imports: [BreadcrumbsComponent,ReactiveFormsModule, CommonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './weekend-settings.component.html',
  styleUrls: ['./weekend-settings.component.scss']
})
export class WeekendSettingsComponent implements OnInit {
  days: string[] = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  weekendForm: FormGroup;

  constructor(private rulesService: GeneralRulesService) {
    this.weekendForm = new FormGroup({
      weekend1: new FormControl('', [Validators.required]),
      weekend2: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void { }

  get getWeekend1() {
    return this.weekendForm.controls['weekend1'];
  }

  get getWeekend2() {
    return this.weekendForm.controls['weekend2'];
  }
  weekendHandler(event: Event): void {
    event.preventDefault(); // Prevent the default form submission
    if (this.weekendForm.valid) {
      console.log('Form Submitted:', this.weekendForm.value);

      // Example of sending the form data to a service
      this.rulesService.addNewRules(this.weekendForm.value).subscribe({
        next: (response) => {
          console.log('Response from API:', response);
        },
        error: (error) => {
          console.log('Error from API:', error);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}