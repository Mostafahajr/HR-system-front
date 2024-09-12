import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
interface EmployeeResponse {
  data: any[];
}
@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  baseUrl: string = "http://pioneer-back.test/api/employees";

  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<EmployeeResponse> {
    return this.http.get<EmployeeResponse>(this.baseUrl);
  }
  getEmployeeById(employeeId:any){
    return this.http.get(`${this.baseUrl}/${employeeId}`)
  }
  deleteEmployee(employeeId:any){
    return this.http.delete(`${this.baseUrl}/${employeeId}`)
  }
  addNewEmployee(employee: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/employees`, employee);
  }
  editEmployee(employeeId:any,employee:any){
    return this.http.put(`${this.baseUrl}/${employeeId}`,employee);

  }
  updateEmployee(employeeId: number, employee: any) {
    return this.http.put(`${this.baseUrl}/${employeeId}`, employee);
  }
  }

