import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class GroupsService {
  baseUrl: any = 'http://pioneer-back.test/api/groups';
  constructor(public http: HttpClient) {}
  getAllGroups() {
    return this.http.get(this.baseUrl);
  }
  deleteGroup(groupId: number) {
    return this.http.delete(`${this.baseUrl}/${groupId}`);
  }
}
