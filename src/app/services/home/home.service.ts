import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  baseUrl: any = 'http://pioneer-back2.test/api/home';
  month: any;
  constructor(public http: HttpClient) {}
  getStatic() {
    const date = new Date();
    const year = date.getFullYear();

    if (date.getMonth() + 1 < 10) {
      this.month = '0' + date.getMonth() + 1;
    } else {
      this.month = date.getMonth() + 1;
    }

    return this.http.get(`${this.baseUrl}`);
  }
}
