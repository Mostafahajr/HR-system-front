import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
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
export class GroupsAndPermissionsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  permissionsContainer: any[] = [];
  groups: any[] = [];
  displayedColumns: string[] = ['id', 'group_name', 'actions'];
  dataSource = new MatTableDataSource<any>(this.permissionsContainer);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private routerSubscription: Subscription;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private groupsService: GroupsService,
    private snackBar: MatSnackBar
  ) {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url === '/groups-and-permissions') {
          this.fetchGroups();
        }
      }
    });
  }

  ngOnInit(): void {
    this.fetchGroups();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  fetchGroups(): void {
    this.groupsService.getAllGroups().subscribe({
      next: (response: any) => {
        this.permissionsContainer = response.data;
        this.dataSource.data = this.permissionsContainer;
        // Reassign the paginator after updating the data source to fix problem of pagination after edit add
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.error('Error fetching groups:', error);
      },
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

  editGroup(id: number) {
    this.router.navigate([`groups-and-permissions/edit/${id}`]);
  }
  deleteGroup(groupId: number) {
    const confirmation = confirm(
      `Are you sure you want to delete group with ID ${groupId}?`
    );
    if (confirmation) {
      this.groupsService.deleteGroup(groupId).subscribe({
        next: () => {
          // Show a success toast notification
          this.showToast('Group deleted successfully!', 'Close');
          // Re-fetch the groups data after deletion
          this.fetchGroups();
        },
        error: (error) => {
          console.log(error);
          // Show an error toast notification
          this.showToast(
            'Failed to delete the group. Please try again.',
            'Close'
          );
        },
      });
    }
  }

  // Toast notification method
  showToast(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'center', // 'start', 'center', 'end', 'left', or 'right'
      verticalPosition: 'bottom', // 'top' or 'bottom'
    });
  }
}
