import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AdminsComponent } from './pages/admins/admins.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { OfficialHolidaysComponent } from './pages/official-holidays/official-holidays.component';
import { AddNewAdminComponent } from './pages/add-new-admin/add-new-admin.component';
import { AddNewEmployeeComponent } from './pages/add-new-employee/add-new-employee.component';
import { SalariesComponent } from './pages/salaries/salaries.component';
import { LoginComponent } from './pages/login/login.component';
import { SalaryRelatedSettingsComponent } from './pages/salary-related-settings/salary-related-settings.component';
import { WeekendSettingsComponent } from './pages/weekend-settings/weekend-settings.component';
import { AddAttendanceComponent } from './pages/add-attendance/add-attendance.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { AddNewGroupComponent } from './pages/add-new-group/add-new-group.component';
import { GroupsAndPermissionsComponent } from './pages/groups-and-permissions/groups-and-permissions.component';
import { AttendanceReportsComponent } from './pages/attendance-reports/attendance-reports.component';
import { EditEmployeeComponent } from './pages/edit-employee/edit-employee.component';
import { ShowComponent } from './pages/show/show.component';
import { InternalServerComponent } from './pages/internal-server/internal-server.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { EditAdminComponent } from './pages/edit-admin/edit-admin.component';
import { authGuard } from './gaurds/auth.guard';
import { EditGroupComponent } from './pages/edit-group-component/edit-group.component';
import { loginGuard } from './gaurds/login.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
    data: { breadcrumb: 'Home' },
  },
  {
    path: 'groups-and-permissions',
    component: GroupsAndPermissionsComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'Groups and Permissions',
      pageName: 'Groups_and_Permissions',
      operation: 'read',
    },
    children: [
      {
        path: 'create',
        component: AddNewGroupComponent,
        canActivate: [authGuard],
        data: {
          breadcrumb: 'Add New Group',
          pageName: 'Groups_and_Permissions',
          operation: 'create',
        },
      },
      {
        path: 'edit/:id',
        component: EditGroupComponent,
        canActivate: [authGuard],
        data: {
          breadcrumb: 'Edit Group',
          pageName: 'Groups_and_Permissions',
          operation: 'update',
        },
      },
    ],
  },
  {
    path: 'admins',
    component: AdminsComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'Users',
      pageName: 'Users',
      operation: 'read',
    },
    children: [
      {
        path: 'create',
        component: AddNewAdminComponent,
        canActivate: [authGuard],
        data: {
          breadcrumb: 'Add New User',
          pageName: 'Users',
          operation: 'create',
        },
      },
      {
        path: 'edit/:id',
        component: EditAdminComponent,
        canActivate: [authGuard],
        data: {
          breadcrumb: 'Edit User',
          pageName: 'Users',
          operation: 'update',
        },
      },
    ],
  },
  {
    path: 'employees',
    component: EmployeesComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'Employees',
      pageName: 'Employees',
      operation: 'read',
    },
    children: [
      {
        path: 'create',
        component: AddNewEmployeeComponent,
        canActivate: [authGuard],
        data: {
          breadcrumb: 'Add New Employee',
          pageName: 'Employees',
          operation: 'create',
        },
      },
      {
        path: 'edit/:id',
        component: EditEmployeeComponent,
        canActivate: [authGuard],
        data: {
          breadcrumb: 'Edit Employee',
          pageName: 'Employees',
          operation: 'update',
        },
      },
      {
        path: 'show/:id',
        component: ShowComponent,
        canActivate: [authGuard],
        data: {
          breadcrumb: 'Show Employee',
          pageName: 'Employees',
          operation: 'read',
        },
      },
    ],
  },
  {
    path: 'salary-related-settings',
    component: SalaryRelatedSettingsComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'Salary Related Settings',
      pageName: 'Salary_Related_Settings',
      operation: 'read',
    },
  },
  {
    path: 'weekend-settings',
    component: WeekendSettingsComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'Weekend Settings',
      pageName: 'Weekend_Settings',
      operation: 'read',
    },
  },
  {
    path: 'official-holidays',
    component: OfficialHolidaysComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'Official Holidays',
      pageName: 'Official_Holidays',
      operation: 'read',
    },
  },
  {
    path: 'attendance-reports',
    component: AttendanceReportsComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'Attendance Reports',
      pageName: 'Attendance_Reports',
      operation: 'read',
    },
    children: [
      {
        path: 'create',
        component: AddAttendanceComponent,
        canActivate: [authGuard],
        data: {
          breadcrumb: 'Add Attendance',
          pageName: 'Attendance_Reports',
          operation: 'create',
        },
      },
    ],
  },
  {
    path: 'salaries',
    component: SalariesComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'Salaries',
      pageName: 'Salaries',
      operation: 'read',
    },
  },
  {
    path: 'departments',
    component: DepartmentsComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'Departments',
      pageName: 'Departments',
      operation: 'read',
    },
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
    data: { breadcrumb: 'Login' },
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'internal-server', component: InternalServerComponent },
  { path: '**', redirectTo: 'not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
