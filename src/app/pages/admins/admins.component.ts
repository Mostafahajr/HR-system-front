import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterOutlet } from '@angular/router';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { AdminsService } from './../../services/admins/admins.service';

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
  ],
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss'],
})
export class AdminsComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'username',
    'group_name',
    'email',
    'actions',
  ];
  dataSource = new MatTableDataSource<UserElement>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router, private userServices: AdminsService) {
    this.getUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  getUsers() {
    this.userServices.getUsers().subscribe({
      next: (response: any) => {
        console.log(response);
        this.dataSource.data = response.data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  isAddNewAdminRoute(): boolean {
    return this.router.url === '/admins';
  }

  viewDetails(element: UserElement) {
    console.log('Viewing details for', element.name);
  }

  editUser(id: number) {
    console.log('Editing user with id', id);
  }

  deleteUser(element: UserElement) {
    console.log('Deleting user', element.name);
  }
}

export interface UserElement {
  id: number;
  username: string;
  name: string;
  group_name: string;
  email: string;
}
