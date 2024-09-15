import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  baseUrl: any = 'http://pioneer-back.test/api/groups';
  constructor(public http: HttpClient) {}

  getAllGroups() {
    return this.http.get(this.baseUrl);
  }
  getGroup(groupId: number) {
    return this.http.get(`${this.baseUrl}/${groupId}`);
  }
  addnewpermissions(group: any) {
    return this.http.post(this.baseUrl, group);
  }
  deletePermission(groupId: number) {
    return this.http.delete(`${this.baseUrl}/${groupId}`);
  }
  updatePermission(groupId: number, group: any) {
    return this.http.put(`${this.baseUrl}/${groupId}`, group);
  }
}
