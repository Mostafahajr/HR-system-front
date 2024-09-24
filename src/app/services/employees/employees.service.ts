
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Employee {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  DOB: string;
  gender:string;
  nationality: string;
  national_id: string;
  arrival_time: string;
  leave_time: string;
  salary: number;
  date_of_contract: string;
  department: {
    id: number;
    name: string;
  };
}

export interface EmployeeResponse {
  data: Employee[];
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

  getEmployeeById(id: number): Observable<any> { // Updated return type
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  getEmployeesByDepartment(departmentId: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}?departmentId=${departmentId}`);
  }
  deleteEmployee(employeeId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${employeeId}`);
  }

  addNewEmployee(employee: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, employee);
  }

  updateEmployee(employeeId: number, employee: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${employeeId}`, employee);
  }
}
