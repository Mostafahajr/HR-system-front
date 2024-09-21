import { AdminsService } from './../../services/admins/admins.service';
import { Component, AfterViewInit, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { Observable, Subscription } from 'rxjs';
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
export class AdminsComponent implements AfterViewInit, OnInit, OnDestroy {
  displayedColumns: string[] = ['no', 'name', 'username', 'group', 'email', 'actions'];
  dataSource = new MatTableDataSource<any>([]); // Initialize with empty MatTableDataSource
  private routerSubscription: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private userServices: AdminsService) {
    // Subscribe to router events to refresh data on navigation
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.router.url === '/admins') {
          this.getUsers(); // Reload users when navigating back to /admins
        }
      }
    });
  }

  ngOnInit(): void {
    this.getUsers();
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  navigate(id: any): void {
    this.router.navigate([`admins/edit/${id}`]);
  }

  getUsers() {
    this.userServices.getUsers().subscribe({
      next: (response) => {
        const formattedData = response.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          username: item.username,
          group: item.group_name,
          group_id: item.group_type_id,
          password: item.password,
          email_verified: item.email_verified_at,
          created_at: item.created_at,
          updated_at: item.updated_at
        }));
        this.dataSource.data = formattedData;
        // Reassign the paginator after updating the data source to fix problem of pagination after edit add
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.log('Error:', error);
      }
    });
  }

  deleteUser(id: any) {
    this.userServices.deleteUser(id).subscribe({
      next: (response) => {
        console.log(response);
        this.getUsers(); // Refresh the list after deletion
      },
      error: (error) => {
        console.log(error);
      }
    });
    this.dataSource.data = this.dataSource.data.filter(user => user.id != id);
  }
  
  isAddNewAdminRoute(): boolean {
    return this.router.url === '/admins';
  }
}