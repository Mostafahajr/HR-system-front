import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class GroupsAndPermissionsService {

  permissionsApiUrl:any='http://localhost:3005/products';
  constructor(public http:HttpClient) { }

  getAllpermissions(){
    return this.http.get(this.permissionsApiUrl);
  }
  getpermission(permissionId:number){
    return this.http.get(`${this.permissionsApiUrl}/${permissionId}`);
  }
  addnewpermissions(permission:any){

    return this.http.post(this.permissionsApiUrl,permission);
  }
  deletePermission(permissionId:number){
    return this.http.delete(`${this.permissionsApiUrl}/${permissionId}`)
  }
  updatePermission(permissionId:number,permission:any){
    return this.http.put(`${this.permissionsApiUrl}/${permissionId}`,permission);
  }
}
