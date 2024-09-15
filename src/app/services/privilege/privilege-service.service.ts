import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrivilegeService {
  prilivegesApiUrl: any = 'http://pioneer-back.test/api/privileges';
  constructor(public http: HttpClient) {}

  getAllpriliveges(): Observable<any> {
    return this.http.get(this.prilivegesApiUrl);
  }
  postPrivileges(payload: any): Observable<any> {
    return this.http.post(`${this.prilivegesApiUrl}`, payload);
  }
}
