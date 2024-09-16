
import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { Router, RouterOutlet } from '@angular/router';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

import {MatDatepickerModule} from '@angular/material/datepicker';


import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AttendanceService } from '../../services/attendance/attendance.service';


export interface UserData {
  id: number;
  name: string;
  department: string;
  arrival: string;
  leave: string;
  date: string;
}

/** Constants used to fill up our data base. */
const ATTENDANCES = [
  { id: 1, name: 'Mohamed Wael', department: 'SuperAdmin', arrival: '9:00 am' ,leave:"5:00 pm",date:"10/10/2023" },
  { id: 2, name: 'Haneen Wael', department: 'Manager', arrival: '9:00 am', leave:"5:00 pm",date:"10/10/2023" },
  { id: 3, name: 'Saja Wael', department: 'SuperVisor', arrival:'9:00 am' ,leave:"5:00 pm",date:"10/10/2023" },
  { id: 4, name: 'Fedaa Wael', department: 'HR', arrival:'9:00 am' ,leave:"5:00 pm",date:"10/10/2023" },
  { id: 5, name: 'Abdo Hesham', department: 'HR', arrival:'9:00 am' ,leave:"5:00 pm",date:"10/10/2023" },
  { id: 6, name: 'Mohamed Wael', department: 'SuperAdmin', arrival: '9:00 am' ,leave:"5:00 pm",date:"02/10/2023" },
  { id: 7, name: 'Haneen Wael', department: 'Manager', arrival: '9:00 am' ,leave:"5:00 pm",date:"03/10/2023" },
  { id: 8, name: 'Saja Wael', department: 'SuperVisor', arrival:'9:00 am' ,leave:"5:00 pm",date:"05/10/2023" },
  { id: 9, name: 'Fedaa Wael', department: 'HR', arrival:'9:00 am',leave:"5:00 pm",date:"05/10/2023"  },
  { id: 10, name: 'Abdo Hesham', department: 'HR', arrival:'9:00 am' ,leave:"5:00 pm",date:"05/10/2023" },
  { id: 11, name: 'Mohamed Wael', department: 'SuperAdmin', arrival: '9:00 am',leave:"5:00 pm",date:"05/10/2023"  },
  { id: 12, name: 'Haneen Wael', department: 'Manager', arrival:'9:00 am',leave:"5:00 pm",date:"05/10/2023"  },
  { id: 13, name: 'Saja Wael', department: 'SuperVisor', arrival:'9:00 am',leave:"5:00 pm",date:"07/10/2023"  },
  { id: 14, name: 'Fedaa Wael', department: 'HR', arrival:'9:00 am' ,leave:"5:00 pm",date:"05/10/2023" },
  { id: 15, name: 'Abdo Hesham', department: 'HR', arrival:'9:00 am',leave:"5:00 pm",date:"05/10/2023"  },
  { id: 16, name: 'Mohamed Wael', department: 'SuperAdmin', arrival: '9:00 am',leave:"5:00 pm",date:"05/10/2023"  },
  { id: 17, name: 'Haneen Wael', department: 'Manager', arrival: '9:00 am', leave:"5:00 pm",date:"05/10/2023" },
  { id: 18, name: 'Saja Wael', department: 'SuperVisor', arrival:'9:00 am',leave:"5:00 pm",date:"05/10/2023"  },
  { id: 19, name: 'Fedaa Wael', department: 'HR', arrival:'9:00 am',leave:"5:00 pm",date:"07/10/2023"  },
  { id: 20, name: 'Abdo Hesham', department: 'HR', arrival:'9:00 am', leave:"5:00 pm",date:"05/10/2023" },
]
@Component({
  selector: 'app-attendance-reports',
  standalone: true,
  imports: [BreadcrumbsComponent,MatDatepickerModule,ReactiveFormsModule,FormsModule, MatExpansionModule,MatIconModule,RouterOutlet,MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './attendance-reports.component.html',
  styleUrl: './attendance-reports.component.scss',
  providers: [provideNativeDateAdapter(),DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttendanceReportsComponent {
  displayedColumns: string[] = ['id', 'name', 'department', 'arrival','leave','actions'];
  dataSource=new MatTableDataSource<UserData>(ATTENDANCES);
  filteredDataSource = new MatTableDataSource(ATTENDANCES);

  startDate: Date | null = null;
  endDate: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit() {
    // this.dataSource = new MatTableDataSource<EmployeeAttendance>([]);
  }

  isAddNewAttendancesRoute(): boolean {

    return this.router.url === '/attendance-reports';
  }

  ngAfterViewInit() {
    this.filteredDataSource.paginator = this.paginator;
    this.filteredDataSource.sort = this.sort;
  }

  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource.filter = filterValue.trim().toLowerCase();

    if (this.filteredDataSource.paginator) {
      this.filteredDataSource.paginator.firstPage();
    }
  }

  applyDateFilter() {
    this.filteredDataSource.data =ATTENDANCES;

    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      console.log(start,end);

      const filteredData = ATTENDANCES.filter(item => {
        const itemDate = new Date(item.date);


        return (itemDate >= start && itemDate <= end);
      });
      console.log(filteredData);
      this.filteredDataSource.data = filteredData;
    } else {
      this.filteredDataSource.data = ATTENDANCES;
    }
  }

  viewDetails(element: UserData) {
    console.log('Viewing details for', element.name);
  }

  editUser(element: UserData) {
    console.log('Editing user', element.name);
  }

  deleteUser(element: UserData) {
    console.log('Deleting user', element.name);
  }
}


