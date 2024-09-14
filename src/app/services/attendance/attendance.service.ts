// src/app/services/attendance.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = 'http://127.0.0.1:8000/api/attendances'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  // Get all attendance records
  getAttendanceRecords(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Get attendance by employee ID
  getAttendanceByEmployeeId(employeeId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employee/${employeeId}`);
  }

  // Record new attendance
  recordAttendance(attendanceData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, attendanceData);
  }

  // Update an attendance record
  updateAttendance(id: number, attendanceData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, attendanceData);
  }

  // Delete an attendance record by ID
  deleteAttendance(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}


