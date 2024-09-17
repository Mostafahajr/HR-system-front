import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VacationDay {
  id: number;
  weekend_day: string;
}

@Injectable({
  providedIn: 'root'
})
export class VacationDaysService {
  private apiUrl = 'http://pioneer-back.test/api/vacation-days';
  
  constructor(private http: HttpClient) {}

  // Fetch all vacation days
  getVacationDays(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Update existing vacation day
  updateVacationDay(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // Create new vacation day
  createVacationDay(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, data);
  }

  deleteVacationDay(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}