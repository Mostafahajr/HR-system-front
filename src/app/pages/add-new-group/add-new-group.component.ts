import { GroupsAndPermissionsService } from './../../services/groups-and-permissions/groups-and-permissions.service';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { FormControl,Validators,FormGroup,ReactiveFormsModule } from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'form-add-new-group',
  styleUrls: ['add-new-group.component.scss'],
  templateUrl: 'add-new-group.component.html',
  standalone: true,
  imports: [MatTableModule,
    MatButton,
    MatTooltip,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
     MatIconModule,
     MatTableModule,
      MatPaginatorModule,
      ReactiveFormsModule
  ],
})
export class AddNewGroupComponent implements AfterViewInit {

  displayedColumns: string[] = ['position', 'name', 'add', 'edit','delete','show'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  showAll:boolean=false;
  custom:boolean=true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private newPermission:GroupsAndPermissionsService){}
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  group =new FormGroup({
    groupName:new FormControl('',[Validators.required])
})


  allPrivlleges() {
    this.showAll=!this.showAll;
    ELEMENT_DATA.forEach(item => (
      item.add = this.showAll,
      item.edit = this.showAll,
      item.delete = this.showAll,
      item.show = this.showAll

    ));
  }
  privateCustom(){
    this.custom = !this.custom;
  }

  get getGroupName(){
    return this.group.controls["groupName"];
  }
  // onAddPermission(permission:any){
  //   this.newPermission.addnewpermissions(`{
  //   "id": 3,
  //   "name": "Clementine Bauch",
  //   "username": "Samantha",
  //   "email": "Nathan@yesenia.net",
  //   "address": {
  //     "street": "Douglas Extension",
  //     "suite": "Suite 847",
  //     "city": "McKenziehaven",
  //     "zipcode": "59590-4157",
  //     "geo": {
  //       "lat": "-68.6102",
  //       "lng": "-47.0653"
  //     }
  //   },
  //   "phone": "1-463-123-4447",
  //   "website": "ramiro.info",
  //   "company": {
  //     "name": "Romaguera-Jacobson",
  //     "catchPhrase": "Face to face bifurcated interface",
  //     "bs": "e-enable strategic applications"
  //   }
  // }`).subscribe({
  //   next:()=>{
  //     console.log("done");
  //   },
  //   error:(error)=>{
  //     console.log(error);
  //   }

  // })
  // }
}



export interface PeriodicElement {
  name: string;
  position: number;
  add: boolean;
  edit: boolean;
  delete:boolean;
  show:any
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', add: false, edit: false,delete: false, show: false},
  {position: 2, name: 'Hy', add: false, edit: false,delete: false, show: false},
  {position: 3, name: 'drogen', add: false, edit: false,delete: false, show: false},


];
export interface groupStru {
  id:number,
  name:string,
  privalges:PeriodicElement[]
}

const group:groupStru[] = [

]


