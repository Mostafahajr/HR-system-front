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
import { IRules } from '../../models/iRules';

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
  typeOptions: string[] = ['increase', 'deduction'];
  currentRule: IRules | null = null;

  constructor(private rulesService: GeneralRulesService) {
    this.salaryForm = new FormGroup({
      type: new FormControl({ value: '', disabled: true }, [Validators.required]),
      hour_amount: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.min(1)])
    });
  }

  ngOnInit(): void {
    this.loadExistingRule();
  }

  loadExistingRule(): void {
    this.rulesService.getAllRules().subscribe({
      next: (rules: IRules[]) => {
        const selectedType = this.salaryForm.get('type')?.value;
        const matchingRule = rules.find(rule => rule.type === selectedType);
        if (matchingRule) {
          this.currentRule = matchingRule;
          this.salaryForm.patchValue({
            type: matchingRule.type,
            hour_amount: matchingRule.hour_amount
          });
        } else {
          this.currentRule = null; // No rule of the selected type exists
        }
      },
      error: (error) => console.error('Error loading rules:', error)
    });
  }


  get getType() {
    return this.salaryForm.controls['type'];
  }

  get getHourAmount() {
    return this.salaryForm.controls['hour_amount'];
  }

  toggleEdit(): void {
    this.isEditable = !this.isEditable;
    if (this.isEditable) {
      this.salaryForm.enable();
    } else {
      this.salaryForm.disable();
    }
  }

  ruleHandler(): void {
    if (this.salaryForm.valid) {
      const formValue: IRules = this.salaryForm.value;

      // Check if the rule of the selected type already exists
      this.rulesService.getAllRules().subscribe({
        next: (rules: IRules[]) => {
          const matchingRule = rules.find(rule => rule.type === formValue.type);

          if (matchingRule) {
            // If rule exists, update it
            this.updateRule({ ...matchingRule, hour_amount: formValue.hour_amount });
          } else {
            // If no rule exists, create a new one
            this.createRule(formValue);
          }
        },
        error: (error) => {
          console.error('Error loading rules:', error);
          alert('Failed to process the rule. Please try again.');
        }
      });
    } else {
      console.warn('Form is invalid');
    }
  }


  private updateRule(rule: IRules): void {
    this.rulesService.updateRule(rule).subscribe({
      next: (updatedRule) => {
        console.log('Rule updated:', updatedRule);
        this.currentRule = updatedRule;
        this.toggleEdit();
        alert('Updated successfully!');
      },
      error: (error) => {
        console.error('Error updating rule:', error);
        alert('Failed to update rule. Please try again.');
      }
    });
  }

  private createRule(rule: IRules): void {
    this.rulesService.addNewRule(rule).subscribe({
      next: (newRule) => {
        console.log('New rule created:', newRule);
        this.currentRule = newRule;
        this.toggleEdit();
        alert('New rule created successfully!');
      },
      error: (error) => {
        console.error('Error creating rule:', error);
        alert('Failed to create rule. Please try again.');
      }
    });
  }
}