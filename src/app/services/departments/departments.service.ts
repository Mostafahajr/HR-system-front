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
  providedIn: 'root'
})
export class DepartmentsService {
  private apiUrl: string = "http://pioneer-back2.test/api/departments"; // Ensure the base URL is correct

  constructor(private http: HttpClient) { }

  // Fetch all departments
  getDepartments(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Fetch a department by ID
  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`);
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
