import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgIf } from '@angular/common';
import { GeneralRulesService } from './../../services/general-rules/general-rules.service';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-salary-related-settings',
  standalone: true,
  imports: [BreadcrumbsComponent, ReactiveFormsModule, CommonModule, MatInputModule, MatFormFieldModule, NgIf,MatButton],
  templateUrl: './salary-related-settings.component.html',
  styleUrls: ['./salary-related-settings.component.scss']
})
export class SalaryRelatedSettingsComponent implements OnInit {
  salaryForm: FormGroup;

  constructor(private rulesService: GeneralRulesService) {
    this.salaryForm = new FormGroup({
      overtime: new FormControl('0', [Validators.required, Validators.min(1)]),
      penalty: new FormControl('0', [Validators.required, Validators.min(1)])
    });
  }

  ngOnInit(): void { }

  get getOvertime() {
    return this.salaryForm.controls['overtime'];
  }

  get getPenalty() {
    return this.salaryForm.controls['penalty'];
  }
  getRule(ruleId: any) {
    this.rulesService.getRule(ruleId).subscribe({
      next: (response) => {
        console.log(response)
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  onUpdate(ruleId: any) {
    this.rulesService.updateRule(`{
    "id": 3,
    "name": "Clementine Bauch",
    "username": "Samantha",
    "email": "Nathan@yesenia.net",
    "address": {
      "street": "Douglas Extension",
      "suite": "Suite 847",
      "city": "McKenziehaven",
      "zipcode": "59590-4157",
      "geo": {
        "lat": "-68.6102",
        "lng": "-47.0653"
      }
    },
    "phone": "1-463-123-4447",
    "website": "ramiro.info",
    "company": {
      "name": "Romaguera-Jacobson",
      "catchPhrase": "Face to face bifurcated interface",
      "bs": "e-enable strategic applications"
    }
  }`, ruleId).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  ondelete(ruleId: number) {
    this.rulesService.deleteRule(ruleId).subscribe({
      next: () => {
        console.log("deleted");
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  onCreate(rule: any) {
    this.rulesService.addNewRules(rule).subscribe({
      next: () => {
        console.log("done");
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  ruleHandler(e: Event): void {
    e.preventDefault(); // Prevent the default form submission

    if (this.salaryForm.valid) {
      console.log('Form Submitted:', this.salaryForm.value);

      // Example of how you might send the form data to a service
      this.rulesService.addNewRules(this.salaryForm.value).subscribe({
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