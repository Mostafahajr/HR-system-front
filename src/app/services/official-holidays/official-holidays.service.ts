import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IHoliday } from '../../models/iHoliday'; // Adjust the path as needed

@Injectable({
  providedIn: 'root',
})
export class OfficialHolidaysService {
  private apiUrl = 'http://pioneer-back2.test/api/off-days'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  getHolidays(): Observable<IHoliday[]> {
    return this.http.get<IHoliday[]>(this.apiUrl);
  }

  addHoliday(holiday: IHoliday): Observable<IHoliday> {
    return this.http.post<IHoliday>(this.apiUrl, holiday);
  }

  updateHoliday(id: string, holiday: IHoliday): Observable<IHoliday> {
    return this.http.put<IHoliday>(`${this.apiUrl}/${id}`, holiday);
  }

  deleteHoliday(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
