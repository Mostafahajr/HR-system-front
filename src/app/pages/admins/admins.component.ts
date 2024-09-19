import { AdminsService } from './../../services/admins/admins.service';
import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [
    BreadcrumbsComponent,
    RouterOutlet,
    MatButtonModule,
    MatTableModule,
    MatPaginator,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss'],
})
export class AdminsComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['no', 'name', 'group', 'email', 'actions'];
  admins: {}={};
  dataSource = new MatTableDataSource<any>([]); // Initialize with empty MatTableDataSource

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private userServices: AdminsService) {}

  ngOnInit(): void {
    this.getUsers();
    this.dataSource.paginator = this.paginator;
  }


  ngAfterViewInit() {
    // Moved to getUsers to ensure data is set before assigning paginator
  }

  navigate(id:any): void {
    this.router.navigate([`admins/edit-admin/${id}`]);
  }

  getUsers() {
    this.userServices.getUsers().subscribe({
      next: (response) => {
        console.log('API Response:', response);

        // Check if response is an array
        const formattedData = response.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          username: item.uesrname,
          group: item.group_name,
          group_id:item.group_type_id,
          password:item.password,
          email_verified:item.email_verified_at,
          created_at:item.created_at,
          updated_at:item.updated_at

        }));

        this.dataSource.data = formattedData;
      },
      error: (error) => {
        console.log('Error:', error);
      }
    });
  }

  isAddNewAdminRoute(): boolean {
    return this.router.url === '/admins';
  }

  // Action buttons methods
  viewDetails(element: any) {
    console.log('Viewing details for', element.name);
  }



  deleteUser(id: any) {
    this.userServices.deleteUser(id).subscribe({
      next:(response)=>{
        console.log(response);
      },
      error:(error)=>{
        console.log(error);
      }
    })
    this.dataSource.data = this.dataSource.data.filter(user => user.id != id);
  }
}

