import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgIf } from '@angular/common';
import { GeneralRulesService } from './../../services/general-rules/general-rules.service';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-salary-related-settings',
  standalone: true,
  imports: [BreadcrumbsComponent, ReactiveFormsModule, CommonModule, MatInputModule, MatFormFieldModule, NgIf, MatButton, MatOption, MatSelect],
  templateUrl: './salary-related-settings.component.html',
  styleUrls: ['./salary-related-settings.component.scss']
})
export class SalaryRelatedSettingsComponent implements OnInit {
  salaryForm: FormGroup;
  isEditable: boolean = false;
  overtimeOptions: string[] = ['Increase', 'Deductions']; // Options for overtime

  constructor(private rulesService: GeneralRulesService) {
    // Form initialization with validators
    this.salaryForm = new FormGroup({
      overtime: new FormControl({ value: '', disabled: true }, [Validators.required]),
      penalty: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.min(1)])
    });
  }

  ngOnInit(): void {
    // Initialize form if you need to load existing data
    // this.getRule(someRuleId);
  }

  // Getters for easier access in the template
  get getOvertime() {
    return this.salaryForm.controls['overtime'];
  }

  get getPenalty() {
    return this.salaryForm.controls['penalty'];
  }

  // Fetch rule data from backend (if needed)
  getRule(ruleId: any) {
    this.rulesService.getRule(ruleId).subscribe({
      next: (response) => {
        console.log(response);
        this.salaryForm.patchValue(response);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  // Update the rule in the backend based on form data
  onUpdate(ruleId: any) {
    if (this.salaryForm.valid) {
      this.rulesService.updateRule(this.salaryForm.value, ruleId).subscribe({
        next: (response) => {
          console.log(response);
          this.toggleEdit(); // Disable editing after save
          alert('Updated successfully!');
        },
        error: (error) => {
          console.log(error);
        }
      });
    } else {
      console.warn('Form is invalid');
    }
  }

  // Enable or disable form controls for editing
  toggleEdit(): void {
    this.isEditable = !this.isEditable;
    if (this.isEditable) {
      this.salaryForm.enable(); // Enable form fields for editing
    } else {
      this.salaryForm.disable(); // Disable form fields after save
    }
  }

  // Handle form submission and call the update function
  ruleHandler(): void {
    if (this.salaryForm.valid) {
      console.log('Form Value:', this.salaryForm.value);
      const selectedOvertime = this.salaryForm.value.overtime;
      const penaltyValue = this.salaryForm.value.penalty;

      console.log(`Selected Overtime: ${selectedOvertime}`);
      console.log(`Penalty: ${penaltyValue}`);

      // Call the update method with the rule ID (you can replace 'ruleId' with actual value)
      this.onUpdate(1); // Assuming ruleId is 1, you should pass the correct ruleId
    } else {
      console.warn('Form is invalid');
    }
  }
}