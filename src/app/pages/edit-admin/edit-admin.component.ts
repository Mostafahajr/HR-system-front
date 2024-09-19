import { Group } from './../../models/iGroup';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule,FormBuilder, FormControl, FormGroup, Validators  } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { EmployeesService } from '../../services/employees/employees.service';
import { AdminsService } from '../../services/admins/admins.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-admin',
  standalone: true,
  imports: [ReactiveFormsModule ,MatSelectModule,MatFormFieldModule, MatInputModule, FormsModule,CommonModule,MatIconModule,MatButton],
  templateUrl: './edit-admin.component.html',
  styleUrl: './edit-admin.component.scss'
})
export class EditAdminComponent implements OnInit{

  selectedValue:string='';
  admins:any;
  hide = true;
  adminId:any;
  groups:any[] = [];
constructor(private userService:AdminsService,private route:ActivatedRoute,private router: Router){
  // this.userService.getUserById()
  this.adminId = this.route.snapshot.params['id'];
  this.userService.getUserById(this.adminId).subscribe({
    next:(response)=>{
      console.log(response.data.name);
      this.getFullName.setValue(response.data.name);
      this.getUsername.setValue(response.data.username);
      this.getEmail.setValue(response.data.email);
      this.getPassword.setValue(response.data.password);
      this.getPermission.setValue(response.data.group_type_id);

    }
  })

}
  ngOnInit(): void {
    this.userService.getGroups().subscribe({
      next:(response)=>{

        console.log(response.data);

        this.groups = response.data;
      }
    })
  }
updateAdminForm =new FormGroup({
  name: new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(20),Validators.pattern(/^[A-Za-z ]{3,}$/)]),
  username: new FormControl('',[Validators.required,Validators.pattern(/^[A-Za-z (.|*|&|^|%|@)]{3,}$/)]),
  email: new FormControl('',[Validators.required,Validators.email]),
  password: new FormControl('',[Validators.required,Validators.pattern(/^[A-Za-z0-9(@|#|$|%)]{8,}$/)]),
  group_type_id: new FormControl('',[Validators.required])
});

get getFullName(){
  return this.updateAdminForm.controls['name']
}
get getUsername(){
  return this.updateAdminForm.controls['username']
}
get getEmail(){
  return this.updateAdminForm.controls['email']
}
get getPassword(){
  return this.updateAdminForm.controls['password']
}
get getPermission(){
  return this.updateAdminForm.controls['group_type_id']
}

 admin(e: any) {
   e.preventDefault();
   if (this.updateAdminForm.valid) {
    this.userService.updateuser(this.adminId,this.updateAdminForm.value).subscribe({
      next:(response)=>{
        console.log(response);
        // this.router.navigate(['admins']);
      },
      error:(error)=>{
        console.log(error);

      }
     })


   }


}
private hasNonEmptyFields(): boolean {
  const formValues = this.updateAdminForm.value;
  return Object.values(formValues).some(value => value !== '' && value !== null);
}


}
