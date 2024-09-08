import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalaryReportsService {
  private baseUrl = 'http://localhost:3005/users';

  constructor(public http: HttpClient) {}

  // GET all reports
  getData(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  // GET a single report?
  showData(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // POST a new report??
  postData(Data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, Data);
  }

  // PUT (update) an existing report
  putData(id: number, Data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, Data);
  }

  // DELETE a user by ID
  deleteData(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
