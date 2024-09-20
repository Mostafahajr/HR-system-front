import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddAttendanceService {
  private baseUrl = 'http://pioneer-back2.test/api/add-new-attendance';

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
}
