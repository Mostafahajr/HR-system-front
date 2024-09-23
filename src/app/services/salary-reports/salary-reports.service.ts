import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalaryReportsService {
  private baseUrl = 'http://pioneer-back2.test/api/salaries/calculate'; // Update the base URL to match your API

  constructor(public http: HttpClient) { }

  // GET all salaries for all employees
  getAllSalaries(year: string, month: string): Observable<any> {
    return this.http.get(`${this.baseUrl}?year=${year}&month=${month}`);
  }

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
