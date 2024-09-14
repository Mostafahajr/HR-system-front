import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; // Import the Router service
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { RouterOutlet, RouterModule } from '@angular/router'; // Import RouterModule
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

// Dialog data interface
export interface DialogData {
  id: number;
  name: string;
}

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
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<any>(this.permissionsContainer);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    // Hard-code a large dataset
    this.permissionsContainer = Array.from({ length: 100 }, (_, index) => ({
      id: index + 1,
      name: `Name ${index + 1}`,
    }));
    this.dataSource.data = this.permissionsContainer;
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

  openViewModal(rowData: any): void {
    const dialogRef = this.dialog.open(ViewEditDialogComponent, {
      width: '300px',
      data: rowData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'delete') {
        this.deleteRow(result.data.id);
      } else if (result?.action === 'edit') {
        this.editRow(result.data.id);
      }
    });
  }

  deleteRow(id: number): void {
    const confirmation = confirm(`Are you sure you want to delete item with ID ${id}?`);
    if (confirmation) {
      this.permissionsContainer = this.permissionsContainer.filter(item => item.id !== id);
      this.dataSource.data = this.permissionsContainer;
    }
  }

  editRow(id: number): void {
    this.router.navigate([`/edit/${id}`]);
  }
}

@Component({
  selector: 'modal-content',
  template: `
    <h1 mat-dialog-title class="modal-title">Details</h1>
    <div mat-dialog-content class="modal-content">
      <p><strong>ID:</strong> {{data.id}}</p>
      <p><strong>Name:</strong> {{data.name}}</p>
    </div>
    <div mat-dialog-actions class="modal-actions">
      <button mat-button class="edit-button" (click)="onEdit()">Edit</button>
      <button mat-button class="delete-button" (click)="onDelete()">Delete</button>
      <button mat-button class="cancel-button" (click)="onNoClick()">Cancel</button>
    </div>
  `,
  styles: [`
    .modal-title {
      background-color: #0560de;
      color: white;
      text-align: center;
      padding: 16px;
    }

    .modal-content {
      padding: 20px;
      font-size: 16px;
      color: #333;
    }

    .modal-actions {
      display: flex;
      justify-content: space-between;
      padding: 10px;
    }

    .edit-button {
      background-color: rgb(88, 144, 88);
      color: #ffffff;
      border-color: rgb(88, 144, 88);
      &:hover {
        background-color: darkgreen;
        border-color: darkgreen;
      }
    }

    .delete-button {
      background-color: rgb(121, 45, 45);
      color: #ffffff;
      border-color: rgb(121, 45, 45);
      &:hover {
        background-color: darkred;
        border-color: darkred;
      }
    }

    .cancel-button {
      background-color: #f5f5f5;
      color: #000;
      border-color: #ccc;
      &:hover {
        background-color: #e0e0e0;
        border-color: #bbb;
      }
    }
  `]
})
export class ViewEditDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onEdit(): void {
    this.dialogRef.close({ action: 'edit', data: this.data });
  }

  onDelete(): void {
    this.dialogRef.close({ action: 'delete', data: this.data });
  }
}
