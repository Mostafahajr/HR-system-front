import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface department {
  name: any;
  id: number;
  department_name: string;
}
export interface DepartmentResponse {
  data: any[];
}
@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  constructor(private http: HttpClient) {}
    apiUrl: string = "http://pioneer-back2.test/api/departments";


    gatDepartments():Observable<DepartmentResponse[]> {
      return this.http.get<DepartmentResponse[]>(`${this.apiUrl}`);
    }
    getDepartmentById(id: number): Observable<department> {
      return this.http.get<department>(`${this.apiUrl}/${id}`);
    }
    // Update existing vacation day
    updateDepartment(id: number, data: any): Observable<department> {
      return this.http.put<department>(`${this.apiUrl}/${id}`, data);
    }

    // Create new vacation day
    addNewDepartment(data: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}`, data);
    }

    deleteDepartment(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
  }
}
