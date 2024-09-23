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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-group',
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
  ],
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss'],
})
export class EditGroupComponent implements OnInit {
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
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.privilegeForm = this.fb.group({
      groupName: ['', Validators.required],
      privileges: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const groupId = this.route.snapshot.params['id'];
    this.loadGroup(groupId);
  }

  loadGroup(groupId: number) {
    this.privilegeService.getGroup(groupId).subscribe((response: any) => {
      this.privilegeForm.patchValue({ groupName: response.group.group_name });
      this.response = this.formatPrivilegesData(response.privileges);
      this.dataSource.data = this.response;
      this.initFormArray();
    });
  }

  formatPrivilegesData(privileges: any) {
    return Object.keys(privileges).map((pageName) => ({
      page_name: pageName,
      operations: privileges[pageName],
    }));
  }

  initFormArray() {
    const privilegeArray = this.privilegeForm.get('privileges') as FormArray;
    this.response.forEach((page: any) => {
      const pageGroup = this.fb.group({
        page_name: [page.page_name],
        operations: this.fb.group({
          create: [this.isOperationSelected(page.operations, 'create')],
          read: [this.isOperationSelected(page.operations, 'read')],
          update: [this.isOperationSelected(page.operations, 'update')],
          delete: [this.isOperationSelected(page.operations, 'delete')],
        }),
      });
      privilegeArray.push(pageGroup);
    });
  }

  isOperationSelected(operations: any[], operationName: string): boolean {
    return operations.some(
      (op) => op.operation === operationName && op.is_selected
    );
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
      const selectedPrivileges = this.getSelectedPrivileges(formData.privileges);
  
      const requestData = {
        group_name: groupName,
        privileges: selectedPrivileges,
      };
  
      const groupId = this.route.snapshot.params['id'];
      this.privilegeService
        .updateGroup(groupId, requestData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log('Group updated successfully', response);
            this.showToast('Group updated successfully'); // Show success toast
            this.router.navigate(['groups-and-permissions']);
          },
          error: (error) => {
            console.error('Error updating group', error);
            this.showToast('Error updating group'); // Show error toast
          },
        });
    }
  }
  showToast(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar'] // You can style this in your CSS
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
