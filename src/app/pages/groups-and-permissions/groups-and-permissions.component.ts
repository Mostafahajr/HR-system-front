import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { RouterOutlet, RouterModule } from '@angular/router';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { MatDialog } from '@angular/material/dialog';
import { GroupsService } from '../../services/groups/groups.service';
@Component({
  selector: 'app-groups-and-permissions',
  standalone: true,
  imports: [
    BreadcrumbsComponent,
    MatButton,
    MatIconModule,
    MatPaginator,
    MatTableModule,
    NgIf,
    RouterOutlet,
    RouterModule,
  ],
  templateUrl: './groups-and-permissions.component.html',
  styleUrls: ['./groups-and-permissions.component.scss'],
})
export class GroupsAndPermissionsComponent implements OnInit, AfterViewInit {
  permissionsContainer: any[] = [];
  groups: any[] = [];
  displayedColumns: string[] = ['id', 'group_name', 'actions'];
  dataSource = new MatTableDataSource<any>(this.permissionsContainer);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private groupsService: GroupsService
  ) {}
  ngOnInit(): void {
    this.fetchGroups();
  }
  fetchGroups(): void {
    this.groupsService.getAllGroups().subscribe((response: any) => {
      this.permissionsContainer = response.data;
      this.dataSource.data = this.permissionsContainer;
    });
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  navigate(route: string): void {
    this.router.navigate([route]);
  }
  isGroupRoute(): boolean {
    return this.router.url === '/groups-and-permissions';
  }
  deleteRow(id: number): void {
    const confirmation = confirm(
      `Are you sure you want to delete item with ID ${id}?`
    );
    if (confirmation) {
      this.permissionsContainer = this.permissionsContainer.filter(
        (item) => item.id !== id
      );
      this.dataSource.data = this.permissionsContainer;
    }
  }
  deleteGroup(groupId: number) {
    const confirmation = confirm(
      `Are you sure you want to delete group with ID ${groupId}?`
    );
    if (confirmation) {
      this.groupsService.deleteGroup(groupId).subscribe({
        next: () => {
          this.router.navigate([this.router.url]).then(() => {
            alert('Group deleted successfully');
          });
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
  editGroup(id: number) {
    this.router.navigate([`groups-and-permissions/edit-group/${id}`]);
  }
}
