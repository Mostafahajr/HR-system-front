import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminsService {

  private apiUrl = 'http://pioneer-back2.test/api';


  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users`);
  }
  getUserById(userId: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`);
  }

  // Fetch group from the API
  getGroups(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/groups`);
  }

  // Record new user
  recordUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, userData);
  }

  updateuser(userId: any, user: any) {
    return this.http.put(`${this.apiUrl}/users/${userId}`, user);
  }

  deleteUser(userId: any) {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }
}
