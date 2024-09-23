import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrivilegeService {
  privilegesApiUrl: any = 'http://pioneer-back2.test/api/privileges';
  constructor(public http: HttpClient) {}

  getAllpriliveges(): Observable<any> {
    return this.http.get(this.privilegesApiUrl);
  }
  postPrivileges(payload: any): Observable<any> {
    return this.http.post(`${this.privilegesApiUrl}`, payload);
  }
  getGroup(id: number): Observable<any> {
    return this.http.get(`${this.privilegesApiUrl}/${id}`);
  }
  updateGroup(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.privilegesApiUrl}/${id}`, payload);
  }
}
