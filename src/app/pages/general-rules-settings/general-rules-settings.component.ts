import { GeneralRulesService } from './../../services/general-rules/general-rules.service';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-general-rules-settings',
  standalone: true,
  imports: [BreadcrumbsComponent,ReactiveFormsModule,CommonModule,MatInputModule,MatFormFieldModule,FormsModule,MatSelectModule],
  templateUrl: './general-rules-settings.component.html',
  styleUrl: './general-rules-settings.component.scss',
})
export class GeneralRulesSettingsComponent implements OnInit{
  days:any[] = ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday']
  rulesContainer:any;
  constructor(private rulesService:GeneralRulesService){
    console.log("done");
  }
  ngOnInit(): void {

  }

  rule = new FormGroup({
    overtime:new FormControl('0',[Validators.required,Validators.min(1)]),
    penalty:new FormControl('0',[Validators.required,Validators.min(1)]),
    weekend1:new FormControl('',Validators.required),
    weekend2:new FormControl('',Validators.required)
  })

  get getOvertime() {
    return this.rule.controls['overtime'];
  }
  get getPenalty() {
    return this.rule.controls['penalty'];
  }
  get getWeekend1() {
    return this.rule.controls['weekend1'];
  }
  get getWeekend2() {
    return this.rule.controls['weekend2'];
  }

  getApiRules(){
    console.log(this.rulesContainer)

  }
  getRule(ruleId:any){
    this.rulesService.getRule(ruleId).subscribe({
      next:(response)=>{
        console.log(response)
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }
  onUpdate(ruleId:any){
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
  }`,ruleId).subscribe({
      next:(response)=>{
        console.log(response);
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }

  ondelete(ruleId:number){
    this.rulesService.deleteRule(ruleId).subscribe({
      next:()=>{
        console.log("deleted");
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }
  onCreate(rule:any){
    this.rulesService.addNewRules(rule).subscribe({
    next:()=>{
      console.log("done");
    },
    error:(error)=>{
      console.log(error);
    }
  })
  }

  ruleHandler(e:any){
    e.preventDefault();
    if (this.rule.status == "VALID") {
      this.rulesService.addNewRules(this.rule.value).subscribe({
        next:(response)=>{
          console.log("response");
        },
        error:(error)=>{
          console.log(error);
        }
      })
    }

  }

}


