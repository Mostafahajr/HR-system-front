import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  baseUrl: string = 'http://pioneer-back.test/api/home';

  constructor(private http: HttpClient) {}

  getEmployeeAttendance(): Observable<any> {
    return this.http.get(`${this.baseUrl}/employee-attendance`);
  }

  getSalaries(year: number, month: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/salaries`, {
      params: { year: year.toString(), month: month },
    });
  }

  getHolidays(): Observable<any> {
    return this.http.get(`${this.baseUrl}/holidays`);
  }

  getDepartmentInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/department-info`);
  }
}