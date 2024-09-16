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
import { authGuard } from './gaurds/auth.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';

import { AddNewGroupComponent } from './pages/add-new-group/add-new-group.component';
import { GroupsAndPermissionsComponent } from './pages/groups-and-permissions/groups-and-permissions.component';
import { EditGroupComponent } from './pages/edit-group-component/edit-group.component';
import { AttendanceReportsComponent } from './pages/attendance-reports/attendance-reports.component';

import { EditEmployeeComponent } from './pages/edit-employee/edit-employee.component';
import { ShowComponent } from './pages/show/show.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, data: { breadcrumb: 'Home' } },
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
        path: 'add-new-group',
        component: AddNewGroupComponent,
        canActivate: [authGuard],
        data: {
          breadcrumb: 'Add New Group',
          pageName: 'Groups_and_Permissions',
          operation: 'create',
        },
      },
      {
        path: 'edit-group/:id',
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
      breadcrumb: 'Admins',
      pageName: 'Admins',
      operation: 'read',
    },
    children: [
      {
        path: 'add-new-admin',
        component: AddNewAdminComponent,
        canActivate: [authGuard],
        data: {
          breadcrumb: 'Add New Admin',
          pageName: 'Admins',
          operation: 'create',
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
        path: 'add-new-employee',
        component: AddNewEmployeeComponent,
        canActivate: [authGuard],
        data: {
          breadcrumb: 'Add New Employee',
          pageName: 'Employeees',
          operation: 'create',
        },
      },
      {
        path: 'edit/:id',
        component: EditEmployeeComponent,
        canActivate: [authGuard],
        data: {
          breadcrumb: 'Edit Employee',
          pageName: 'Employeees',
          operation: 'edit',
        },
      },
      {
        path: 'show/:id',
        component: ShowComponent,
        canActivate: [authGuard],
        data: {
          breadcrumb: 'show Employee',
          pageName: 'Employeees',
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
        path: 'add-attendance',
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
  // Add the login route
  { path: 'login', component: LoginComponent, data: { breadcrumb: 'Login' } },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
