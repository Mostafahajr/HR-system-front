import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IHoliday } from '../../models/iHoliday';

@Injectable({
  providedIn: 'root',
})
export class OfficialHolidaysService {
  private apiUrl = 'http://localhost:3005/holidays';
  constructor(public http: HttpClient) { }

  // get all holidays
  getAllHolidays(): Observable<IHoliday[]> {
    return this.http.get<IHoliday[]>(`${this.apiUrl}`);
  }
  // get one holiday
  getHolidayById(holidayId: string): Observable<IHoliday> {
    return this.http.get<IHoliday>(`${this.apiUrl}/${holidayId}`);
  }
  // add a holiday
  addHoliday(holiday: IHoliday) : Observable<any> {
    return this.http.post(`${this.apiUrl}`, holiday);
  }
  // update a holidaya
  updateHoliday(holidayId: string, holiday: IHoliday): Observable<any>  {
    return this.http.put(`${this.apiUrl}/${holidayId}`, holiday);
  }
  // delete a holiday
  deleteHoliday(holidayId: string) : Observable<any> {
    return this.http.delete<void>(`${this.apiUrl}/${holidayId}`);
  }
}
