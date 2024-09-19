import { AdminsService } from './../../services/admins/admins.service';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';  // Import MatIconModule
import { Router, RouterOutlet } from '@angular/router';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [
    BreadcrumbsComponent,
    RouterOutlet,
    MatButtonModule,
    MatTableModule,
    MatPaginator,
    MatIconModule  // Add MatIconModule to the imports
  ],
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss'],
})
export class AdminsComponent implements AfterViewInit {
  displayedColumns: string[] = ['no', 'name', 'group', 'email', 'actions'];
  dataSource = new MatTableDataSource<UserElement>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router,private userServices:AdminsService) {
    this.getUsers()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  getUsers(){
    this.userServices.getUsers().subscribe({
      next:(response)=>
      {
        console.log(response);

        this.dataSource = response;
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }

  isAddNewAdminRoute(): boolean {
    return this.router.url === '/admins';
  }

  // Action buttons methods
  viewDetails(element: UserElement) {
    console.log('Viewing details for', element.name);
  }

  editUser(element: UserElement) {
    console.log('Editing user', element.name);
  }

  deleteUser(element: UserElement) {
    console.log('Deleting user', element.name);
  }
}

export interface UserElement {
  no: number;
  name: string;
  group: string;
  email: string;
}

const USER_DATA: UserElement[] = [
  { no: 1, name: 'Mohamed Wael', group: 'SuperAdmin', email: 'mohamed@gmail.com' },
  { no: 2, name: 'Haneen Wael', group: 'Manager', email: 'Haneen@gmail.com' },
  { no: 3, name: 'Saja Wael', group: 'SuperVisor', email: 'Saja@gmail.com' },
  { no: 4, name: 'Fedaa Wael', group: 'HR', email: 'fedaa@gmail.com' },
  { no: 5, name: 'Abdo Hesham', group: 'HR', email: 'Abdo@gmail.com' },
  { no: 6, name: 'Mohamed Wael', group: 'SuperAdmin', email: 'mohamed@gmail.com' },
  { no: 7, name: 'Haneen Wael', group: 'Manager', email: 'Haneen@gmail.com' },
  { no: 8, name: 'Saja Wael', group: 'SuperVisor', email: 'Saja@gmail.com' },
  { no: 9, name: 'Fedaa Wael', group: 'HR', email: 'fedaa@gmail.com' },
  { no: 10, name: 'Abdo Hesham', group: 'HR', email: 'Abdo@gmail.com' },
  { no: 11, name: 'Mohamed Wael', group: 'SuperAdmin', email: 'mohamed@gmail.com' },
  { no: 12, name: 'Haneen Wael', group: 'Manager', email: 'Haneen@gmail.com' },
  { no: 13, name: 'Saja Wael', group: 'SuperVisor', email: 'Saja@gmail.com' },
  { no: 14, name: 'Fedaa Wael', group: 'HR', email: 'fedaa@gmail.com' },
  { no: 15, name: 'Abdo Hesham', group: 'HR', email: 'Abdo@gmail.com' },
  { no: 16, name: 'Mohamed Wael', group: 'SuperAdmin', email: 'mohamed@gmail.com' },
  { no: 17, name: 'Haneen Wael', group: 'Manager', email: 'Haneen@gmail.com' },
  { no: 18, name: 'Saja Wael', group: 'SuperVisor', email: 'Saja@gmail.com' },
  { no: 19, name: 'Fedaa Wael', group: 'HR', email: 'fedaa@gmail.com' },
  { no: 20, name: 'Abdo Hesham', group: 'HR', email: 'Abdo@gmail.com' },
];
