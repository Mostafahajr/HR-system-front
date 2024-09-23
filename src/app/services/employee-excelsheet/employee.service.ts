import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Employee} from '../../models/iEmployee';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://pioneer-back.test/api/employees'; // Your API URL

  constructor(private http: HttpClient) {}

  // In employees.service.ts
  getEmployeesByDepartment(departmentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?department_id=${departmentId}`);
  }


}
