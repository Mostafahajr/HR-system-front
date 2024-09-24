import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddAttendanceService {
  private baseUrl = 'http://pioneer-back.test/api/add-new-attendance';

  constructor(private http: HttpClient) {}

  getAllAttendance(date: string, department: string): Observable<any> {
    let params = new HttpParams()
      .set('department', department)
      .set('date', date);

    console.log('Request URL:', `${this.baseUrl}?${params.toString()}`);
    console.log('Request Params:', { date, department });

    return this.http.get(this.baseUrl, { params });
  }

  updateAttendance(id: number, payload: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, payload);
  }

  deleteAttendance(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // New method for bulk creation of attendance records
  bulkCreateAttendance(): Observable<any> {
    return this.http.post(`${this.baseUrl}/bulk-create`, {}); // Assuming no body needed
  }
}
