import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Salary {
  id: number;
  type: string;
  hour_amount:number;
}

@Injectable({
  providedIn: 'root'
})
export class HourRuleService {

  private apiUrl = 'http://pioneer-back.test/api/hour-rules';
  
  constructor(private http: HttpClient) {}

  // Fetch all hour salary rules
  getHourSalaryRules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Fetch a single hour salary rule by ID
  getHourSalaryRule(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Update an existing hour salary rule
  updateHourSalaryRule(id: number, data:any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // Create a new hour salary rule
  createHourSalaryRule(data: { hour: number; salary: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, data);
  }

  // Delete an hour salary rule
  deleteHourSalaryRule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
