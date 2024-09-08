import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  baseUrl:string ="http://localhost:3005/empolyees"
  constructor(public http:HttpClient) { }
  
  getAllEmployees(){
    return this.http.get(this.baseUrl)
  }
  getEmployeeById(employeeId:any){
    return this.http.get(`${this.baseUrl}/${employeeId}`)
  }
  deleteEmployee(employeeId:any){
    return this.http.delete(`${this.baseUrl}/${employeeId}`)
  }
  addNewEmployee(employee:any){
    return this.http.post(this.baseUrl,employee);
  }
  editEmployee(employeeId:any,employee:any){
    return this.http.put(`${this.baseUrl}/${employeeId}`,employee);

  }
  updateEmployee(employeeId: number, employee: any) {
    return this.http.put(`${this.baseUrl}/${employeeId}`, employee);
  }
  }

