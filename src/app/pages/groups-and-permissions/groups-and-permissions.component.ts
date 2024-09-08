import { Component, OnInit } from '@angular/core';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { Router, RouterOutlet } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { GroupsAndPermissionsService } from '../../services/groups-and-permissions/groups-and-permissions.service';

@Component({
  selector: 'app-groups-and-permissions',
  standalone: true,
  imports: [BreadcrumbsComponent, MatButton, RouterOutlet,NgIf],
  templateUrl: './groups-and-permissions.component.html',
  styleUrl: './groups-and-permissions.component.scss',
})
export class GroupsAndPermissionsComponent implements OnInit {
  permissionsContainer:any;
  constructor(private router: Router,private permissions:GroupsAndPermissionsService) {}
   ngOnInit(): void {
    this.permissions.getpermissions().subscribe({
      next:(response)=>{
        console.log(response);
        this.permissionsContainer = response;
      },
      error:(error)=>{
        console.log(error);
      }

    })
  }


  getAllPermissions(){
    console.log(this.permissionsContainer)

  }
  getPermission(permissionId:any){
    this.permissions.getpermission(permissionId).subscribe({
      next:(response)=>{
        console.log(response)
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }
  onUpdate(permissionId:any){
    this.permissions.updatePermission(permissionId,`{
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
  }`).subscribe({
      next:(response)=>{
        console.log(response);
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }

  ondelete(permissionId:number){
    this.permissions.deletePermission(permissionId).subscribe({
      next:()=>{
        console.log("deleted");
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }
  onCreate(){
    this.permissions.addnewpermissions(`{
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


  navigate(route: string): void {
    this.router.navigate([route]);
  }
  isAddNewGroupRoute(): boolean {
    return this.router.url === '/groups-and-permissions';
  }
}
