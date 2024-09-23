import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { PrivilegeService } from '../../services/privilege/privilege-service.service';
import { Privilege } from '../../models/iPrivilege';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-new-group',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    RouterOutlet,
  ],
  templateUrl: './add-new-group.component.html',
  styleUrls: ['./add-new-group.component.scss'],
})
export class AddNewGroupComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'page',
    'create',
    'read',
    'update',
    'delete',
  ];
  dataSource = new MatTableDataSource<any>();
  privilegeForm: FormGroup;
  response: any;
  private destroy$ = new Subject<void>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private privilegeService: PrivilegeService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {
    this.privilegeForm = this.fb.group({
      groupName: ['', Validators.required],
      privileges: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.getAllPrivileges();
  }

  getAllPrivileges() {
    this.privilegeService
      .getAllpriliveges()
      .subscribe((response: { data: Privilege[] }) => {
        this.response = this.groupPrivilegesByPage(response.data);
        this.dataSource.data = this.response;
        this.initFormArray();
      });
  }

  groupPrivilegesByPage(privileges: Privilege[]) {
    return privileges.reduce((acc: any, privilege: Privilege) => {
      const page = acc.find((p: any) => p.page_name === privilege.page_name);
      if (page) {
        page.operations.push(privilege);
      } else {
        acc.push({ page_name: privilege.page_name, operations: [privilege] });
      }
      return acc;
    }, []);
  }

  initFormArray() {
    const privilegeArray = this.privilegeForm.get('privileges') as FormArray;
    this.response.forEach((page: any) => {
      const pageGroup = this.fb.group({
        page_name: [page.page_name],
        operations: this.fb.group({
          create: [false],
          read: [false],
          update: [false],
          delete: [false],
        }),
      });
      privilegeArray.push(pageGroup);
    });
  }

  toggleAllRows(event: any) {
    const checked = event.checked;
    const privilegeArray = this.privilegeForm.get('privileges') as FormArray;
    privilegeArray.controls.forEach((group: AbstractControl) => {
      const operationsGroup = group.get('operations') as FormGroup;
      Object.keys(operationsGroup.controls).forEach((key) => {
        operationsGroup.get(key)?.setValue(checked);
      });
    });
  }

  isAllChecked(): boolean {
    const privilegeArray = this.privilegeForm.get('privileges') as FormArray;
    return privilegeArray.controls.every((group: AbstractControl) => {
      const operationsGroup = group.get('operations') as FormGroup;
      return Object.keys(operationsGroup.controls).every(
        (key) => operationsGroup.get(key)?.value
      );
    });
  }

  toggleRow(event: any, rowIndex: number) {
    const checked = event.checked;
    const rowGroup = (this.privilegeForm.get('privileges') as FormArray).at(
      rowIndex
    ) as FormGroup;
    const operationsGroup = rowGroup.get('operations') as FormGroup;
    Object.keys(operationsGroup.controls).forEach((key) => {
      operationsGroup.get(key)?.setValue(checked);
    });
  }

  isRowChecked(rowIndex: number): boolean {
    const rowGroup = (this.privilegeForm.get('privileges') as FormArray).at(
      rowIndex
    ) as FormGroup;
    const operationsGroup = rowGroup.get('operations') as FormGroup;
    return Object.keys(operationsGroup.controls).some(
      (key) => operationsGroup.get(key)?.value
    );
  }

  submit() {
    if (this.privilegeForm.valid) {
      const formData = this.privilegeForm.value;
      const groupName = formData.groupName;
      const selectedPrivileges = this.getSelectedPrivileges(
        formData.privileges
      );

      const requestData = {
        group_name: groupName,
        privileges: selectedPrivileges,
      };

      this.privilegeService
        .postPrivileges(requestData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log('Group created successfully', response);
            this.openSnackBar('Group created successfully!', 'Close');
            this.router.navigate(['groups-and-permissions']);
          },
          error: (error) => {
            console.error('Error creating group', error);
            this.openSnackBar('Error creating group. Please try again.', 'Close');
          },
          complete: () => {
            console.log('Request completed');
          },
        });
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000, // Duration in milliseconds
    });
  }

  getSelectedPrivileges(privileges: any[]): number[] {
    const selectedPrivileges: number[] = [];
    privileges.forEach((page) => {
      Object.entries(page.operations).forEach(([operation, isSelected]) => {
        if (isSelected) {
          const privilege = this.response
            .find((p: any) => p.page_name === page.page_name)
            .operations.find((op: Privilege) => op.operation === operation);
          if (privilege) {
            selectedPrivileges.push(privilege.id);
          }
        }
      });
    });
    return selectedPrivileges;
  }

  getPrivilegeControl(pageIndex: number, operation: string): FormControl {
    const pageGroup = (this.privilegeForm.get('privileges') as FormArray).at(
      pageIndex
    ) as FormGroup;
    const operationsGroup = pageGroup.get('operations') as FormGroup;
    return operationsGroup.get(operation) as FormControl;
  }
}
