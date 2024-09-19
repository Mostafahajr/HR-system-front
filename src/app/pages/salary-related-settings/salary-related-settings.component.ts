import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgIf } from '@angular/common';
import { GeneralRulesService } from './../../services/general-rules/general-rules.service';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { MatButton } from '@angular/material/button';
import { IRules } from '../../models/iRules';

@Component({
  selector: 'app-salary-related-settings',
  standalone: true,
  imports: [BreadcrumbsComponent, ReactiveFormsModule, CommonModule, MatInputModule, MatFormFieldModule, NgIf, MatButton],
  templateUrl: './salary-related-settings.component.html',
  styleUrls: ['./salary-related-settings.component.scss']
})
export class SalaryRelatedSettingsComponent implements OnInit {
  salaryForm: FormGroup;
  isEditable: boolean = false;
  overtimeRule: IRules | null = null;
  penaltyRule: IRules | null = null;

  private updateSuccessCount: number = 0;
  private updateFailureCount: number = 0;
  private requiredUpdates: number = 2;

  constructor(private rulesService: GeneralRulesService) {
    this.salaryForm = new FormGroup({
      overtime: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.min(1)]),
      penalty: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.min(1)])
    });
  }

  ngOnInit(): void {
    this.loadExistingRules();
  }

  loadExistingRules(): void {
    this.rulesService.getAllRules().subscribe({
      next: (rules: IRules[]) => {
        this.overtimeRule = rules.find(rule => rule.type === 'increase') || null;
        this.penaltyRule = rules.find(rule => rule.type === 'deduction') || null;

        this.salaryForm.patchValue({
          overtime: this.overtimeRule?.hour_amount || '',
          penalty: this.penaltyRule?.hour_amount || ''
        });
      },
      error: (error) => {
        console.error('Error loading rules:', error);
        alert('Failed to load salary rules. Please try again later.');
      }
    });
  }

  get getOvertime() {
    return this.salaryForm.controls['overtime'];
  }

  get getPenalty() {
    return this.salaryForm.controls['penalty'];
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
      const formValue = this.salaryForm.value;

      this.updateSuccessCount = 0;
      this.updateFailureCount = 0;

      this.updateOrCreateRule('increase', formValue.overtime);
      this.updateOrCreateRule('deduction', formValue.penalty);
    } else {
      console.warn('Form is invalid');
    }
  }

  private updateOrCreateRule(type: 'increase' | 'deduction', hour_amount: number): void {
    const existingRule = type === 'increase' ? this.overtimeRule : this.penaltyRule;

    if (existingRule) {
      this.updateRule({ ...existingRule, hour_amount });
    } else {
      this.createRule({ type, hour_amount } as IRules);
    }
  }

  private updateRule(rule: IRules): void {
    this.rulesService.updateRule(rule).subscribe({
      next: (updatedRule) => {
        console.log('Rule updated:', updatedRule);
        this.updateLocalRule(updatedRule);
        this.handleUpdateSuccess();
      },
      error: (error) => {
        console.error('Error updating rule:', error);
        this.handleUpdateFailure(error);
      }
    });
  }

  private createRule(rule: IRules): void {
    this.rulesService.addNewRule(rule).subscribe({
      next: (newRule) => {
        console.log('New rule created:', newRule);
        this.updateLocalRule(newRule);
        this.handleUpdateSuccess();
      },
      error: (error) => {
        console.error('Error creating rule:', error);
        this.handleUpdateFailure(error);
      }
    });
  }

  private updateLocalRule(rule: IRules): void {
    if (rule.type === 'increase') {
      this.overtimeRule = rule;
    } else if (rule.type === 'deduction') {
      this.penaltyRule = rule;
    }
  }

  private handleUpdateSuccess(): void {
    this.updateSuccessCount++;
    if (this.updateSuccessCount === this.requiredUpdates) {
      this.loadExistingRules(); // Reload the rules after successful updates
      this.toggleEdit();
      alert('All rules updated successfully!');
    }
  }
  

  private handleUpdateFailure(error: any): void {
    this.updateFailureCount++;
    if (this.updateFailureCount === 1) { // Only alert once for the first failure
      console.error('Error updating rule:', error);
      alert('Failed to update one or more rules. Please try again.');
    }
  }
}