
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GroupsAndPermissionsComponent } from './pages/groups-and-permissions/groups-and-permissions.component';
import { AdminsComponent } from './pages/admins/admins.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { OfficialHolidaysComponent } from './pages/official-holidays/official-holidays.component';
import { AttendanceReportsComponent } from './pages/attendance-reports/attendance-reports.component';
import { AddNewGroupComponent } from './pages/add-new-group/add-new-group.component';
import { AddNewAdminComponent } from './pages/add-new-admin/add-new-admin.component';
import { AddNewEmployeeComponent } from './pages/add-new-employee/add-new-employee.component';
import { SalariesComponent } from './pages/salaries/salaries.component';
import { LoginComponent } from './pages/login/login.component';  // Import LoginComponent
import { SalaryRelatedSettingsComponent } from './pages/salary-related-settings/salary-related-settings.component';
import { WeekendSettingsComponent } from './pages/weekend-settings/weekend-settings.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, data: { breadcrumb: 'Home' } },
  {
    path: 'groups-and-permissions',
    component: GroupsAndPermissionsComponent,
    data: { breadcrumb: 'Groups and Permissions' },
    children: [
      {
        path: 'add-new-group',
        component: AddNewGroupComponent,
        data: { breadcrumb: 'Add New Group' },
      },
    ],
  },
  {
    path: 'admins',
    component: AdminsComponent,
    data: { breadcrumb: 'Admins' },
    children: [
      {
        path: 'add-new-admin',
        component: AddNewAdminComponent,
        data: { breadcrumb: 'Add New Admin' },
      },
    ],
  },
  {
    path: 'employees',
    component: EmployeesComponent,
    data: { breadcrumb: 'Employees' },
    children: [
      {
        path: 'add-new-employee',
        component: AddNewEmployeeComponent,
        data: { breadcrumb: 'Add New Employee' },
      },
    ],
  },
  {
    path: 'salary-related-settings',
    component: SalaryRelatedSettingsComponent,
    data: { breadcrumb: 'Salary Related Settings' },
  },
  {
    path: 'weekend-settings',
    component: WeekendSettingsComponent,
    data: { breadcrumb: 'Weekend Settings' },
  },
  {
    path: 'official-holidays',
    component: OfficialHolidaysComponent,
    data: { breadcrumb: 'Official Holidays' },
  },
  {
    path: 'attendance-reports',
    component: AttendanceReportsComponent,
    data: { breadcrumb: 'Attendance Reports' },
  },
  {
    path: 'salaries',
    component: SalariesComponent,
    data: { breadcrumb: 'Salaries' },
  },
  // Add the login route
  { path: 'login', component: LoginComponent, data: { breadcrumb: 'Login' } },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// authentication
// employee
// admin(users)
// attendance
// official_holidays
// salary_invoices
// departments??
// salary_reports
