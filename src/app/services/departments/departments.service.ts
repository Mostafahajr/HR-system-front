import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../../models/iEmployee';

export interface Department {
  id: number;
  name: string;  // Change 'any' to 'string' for better type safety
  department_name: string;
}

export interface DepartmentResponse {
  data: Department[];
}

@Injectable({
  providedIn: 'root',
})
export class DepartmentsService {
  constructor(private http: HttpClient) {}
  apiUrl: string = 'http://pioneer-back.test/api/departments';

  getDepartments(): Observable<DepartmentResponse> {
    return this.http.get<DepartmentResponse>(`${this.apiUrl}`);
  }

  // Fetch employees based on department ID
  getEmployeesByDepartment(departmentId: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/${departmentId}/employees`);
  }


  // Update an existing department
  updateDepartment(id: number, data: any): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/${id}`, data);
  }

  // Create a new department
  addNewDepartment(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Delete a department
  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
