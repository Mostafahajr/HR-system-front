import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {

  private apiUrl = 'http://pioneer-back2.test/api/attendance';


  constructor(private http: HttpClient) {}

  getAttendances(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  // Fetch departments from the API
  getDepartments(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/departments`);
  }

  // Record new attendance
  recordAttendance(attendanceData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, attendanceData);
  }

  updateAttendance(attendanceId: any, attendance: any) {
    return this.http.put(`${this.apiUrl}/${attendanceId}`, attendance);
  }

  deleteAttendance(attendanceId: any) {
    return this.http.delete(`${this.apiUrl}/${attendanceId}`);
  }
}
