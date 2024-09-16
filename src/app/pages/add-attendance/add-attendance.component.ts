import { AttendanceService } from './../../services/attendance/attendance.service';
import {AfterViewInit, Component, OnInit, signal, ViewChild} from '@angular/core';
import { FormBuilder,FormArray,FormGroup,ReactiveFormsModule, Validators,FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';


const EMPLOYEES=[
  {
    id:1,
    name:"mos",
    department:"finance",
  },
  {
    id:2,
    name:"mosta",
    department:"marketing",
  },
  {
    id:3,
    name:"mosra",
    department:"finance",
  },
  {
    id:4,
    name:"moafa",
    department:"marketing",
  },
  {
    id:5,
    name:"ostafa",
    department:"finance",
  },{
    id:6,
    name:"mstafa",
    department:"marketing",
  },
  {
    id:7,
    name:"motafa",
    department:"finance",
  },{
    id:8,
    name:"mostafa",
    department:"marketing",
  },

]



@Component({
  selector: 'app-add-attendance',
  standalone: true,
  imports: [ReactiveFormsModule,MatInputModule,MatFormFieldModule,FormsModule,MatIconModule,MatPaginatorModule],
  templateUrl: './add-attendance.component.html',
  styleUrl: './add-attendance.component.scss'
})
export class AddAttendanceComponent implements AfterViewInit,OnInit{


  attendances:any;
  employees= EMPLOYEES;
  employeeForm:any;
  _filterText:string='';
  filteredEmployees:any[]=[];
  events = signal<string[]>([]);

  currentDate:Date=new Date();
  currentDateString: string = '';
  currentTimeString: string='';



  pagedItems: any[] = []; // Array to store paginated data
  pageSize = 20;          // Number of items per page
  currentPage = 0;        // Current page index
  totalPages: number = 0; // Total number of pages

 isSubmited:boolean=true;
  constructor(private fb:FormBuilder,private attendanceService:AttendanceService) {


    // this.filteredEmployees = this.employees;


  }
  ngOnInit(): void {

    this.employeeForm = this.fb.group(
      {
        tableRows:this.fb.array([])
      }
    )





    this.currentDateString = this.currentDate.toLocaleDateString(); // Gets the date
    this.currentTimeString = this.currentDate.toLocaleTimeString(); // Gets the time
    // this.filteredEmployees.forEach((emp)=>{
    //   this.createRows(emp.id,emp.department,emp.name,this.currentDateString);
    // })





  }

  get getAttendance(){
    const control = this.employeeForm.get("tableRows") as FormArray;
    return control;
  }



  ngAfterViewInit() {

  }
  applyFilter(e:any) {

    this.employeeForm.value = [];
    const filterValue = (e.target as HTMLInputElement).value;

    this.filteredEmployees =  EMPLOYEES.filter((employee)=>{
        return employee.department.toLowerCase() == filterValue.toLowerCase()
    })
    this.filteredEmployees.forEach((emp)=>{
      this.createRows(emp.id,emp.department,emp.name,this.currentDateString);
    })

    this.getPagedItems();
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize);


  }
  createRows(id:any,department:any,name:any,currentDate:string){

    this.attendances = this.fb.group(
      {
        id:[id],
        department:[department],
        name:[name],
        arrival:['',Validators.required],
        leave:['',Validators.required],
        date:[currentDate],

      }

    )
    let control =  this.employeeForm.get("tableRows") as FormArray;

    // while (control.length !== 0) {
    //   control.removeAt(0);
    // }

    control.push(this.attendances);

  }




  onSubmit(e:any){
    e.preventDefault();
    this.isSubmited = false;
    const form = this.filteredEmployees;


    this.attendanceService.recordAttendance(form).subscribe({
      next:(responce)=>{
        console.log(responce);
      },
      error:(error)=>{
        console.log(error);
      }
    });
    console.log(form);
  }

  deleteUser(i:number){

    this.filteredEmployees=this.filteredEmployees.filter((emp)=>{
      return emp.id != i;
    })
    this.filteredEmployees.splice(i,1);
    // this.filteredEmployees.forEach((emp)=>{
    //   this.createRows(emp.id,emp.department,emp.name,this.currentDateString);
    // })


    let control =  this.employeeForm.get("tableRows") as FormArray;
    control.clear();
    this.employeeForm.data = this.filteredEmployees;
    this.filteredEmployees.forEach(emp=>{
      this.createRows(emp.id,emp.department,emp.name,this.currentDateString);
    })
    this.getPagedItems();
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.pageSize);


console.log(this.employeeForm.get("tableRows").value);

    console.log("deleted successfully");
  }

  getPagedItems(): void {
    const start = this.currentPage * this.pageSize;
    console.log(start);
    const end = start + this.pageSize;
    this.pagedItems = this.filteredEmployees.slice(start, end);
    // console.log(this.pagedItems.length);

  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.getPagedItems();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getPagedItems();
    }
  }

}


