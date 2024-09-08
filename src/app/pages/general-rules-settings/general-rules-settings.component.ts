import { GeneralRulesService } from './../../services/general-rules/general-rules.service';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-general-rules-settings',
  standalone: true,
  imports: [BreadcrumbsComponent],
  templateUrl: './general-rules-settings.component.html',
  styleUrl: './general-rules-settings.component.scss',
})
export class GeneralRulesSettingsComponent implements OnInit{
  rulesContainer:any;
  constructor(private rulesService:GeneralRulesService){
    console.log("done");
  }
  ngOnInit(): void {
    this.rulesService.getRules().subscribe({
      next:(response)=>{

        this.rulesContainer = response
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }

  getAllRules(){
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
  onCreate(){
    this.rulesService.addNewRules(`{
    "id": 1,
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
  }`).subscribe({
    next:()=>{
      console.log("done");
    },
    error:(error)=>{
      console.log(error);
    }
  })
  }

}
