import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SalaryReportsService } from '../../services/salary-reports/salary-reports.service';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-salaries',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './salaries.component.html',
  styleUrl: './salaries.component.scss',
})
export class SalariesComponent {
  response: any;

  constructor(private salaryReportsService: SalaryReportsService) {}

  getAllUsers() {
    this.salaryReportsService.getData().subscribe((data) => {
      this.response = data;
    });
  }

  getUser(id: number) {
    this.salaryReportsService.showData(id).subscribe((data) => {
      this.response = data;
    });
  }

  createUser() {
    const newUser = { name: 'New User', email: 'newuser@example.com' };
    this.salaryReportsService.postData(newUser).subscribe((data) => {
      this.response = data;
    });
  }

  updateUser(id: number) {
    const updatedUser = {
      name: 'Updated User',
      email: 'updateduser@example.com',
    };
    this.salaryReportsService.putData(id, updatedUser).subscribe((data) => {
      this.response = data;
    });
  }

  deleteUser(id: number) {
    this.salaryReportsService.deleteData(id).subscribe((data) => {
      this.response = data;
    });
  }
}
