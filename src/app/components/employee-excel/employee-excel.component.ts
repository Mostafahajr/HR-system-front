import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee-excelsheet/employee.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-excel',
  templateUrl: './employee-excel.component.html',
  styleUrls: ['./employee-excel.component.scss']
})
export class EmployeeExcelComponent implements OnInit {
  private apiUrl = 'http://pioneer-back.test/api/employees';
  private departmentsUrl = 'http://pioneer-back.test/api/departments';
  private fixedDate = '2024-09-06';

  constructor(private employeeService: EmployeeService, private http: HttpClient) {}

  ngOnInit(): void {
    // Optionally, fetch departments on initialization if needed
    // this.fetchDepartments();
  }

  async generateExcelFiles(): Promise<void> {
    const allEmployees = await this.fetchEmployees();
    const departments = await this.fetchDepartments();

    departments.forEach(department => {
      const departmentEmployees = allEmployees.filter(employee => employee.department.name === department.name);
      if (departmentEmployees.length) {
        this.createExcelFile(department.name, departmentEmployees);
      }
    });
  }

  async fetchEmployees(): Promise<any[]> {
    try {
      const response = await this.http.get<any>(this.apiUrl).toPromise();
      return response.data; // Adjust this based on your API response structure
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  }

  async fetchDepartments(): Promise<any[]> {
    try {
      const response = await this.http.get<any>(this.departmentsUrl).toPromise();
      return response.data; // Adjust this based on your API response structure
    } catch (error) {
      console.error('Error fetching departments:', error);
      return [];
    }
  }

  formatTime(dateTime: string): string {
    const date = new Date(dateTime);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  createExcelFile(departmentName: string, employees: any[]): void {
    const fileName = `${departmentName}_${this.fixedDate}.xlsx`;

    const wsData = employees.map(employee => ({
      Name: employee.name || 'Unknown',
      ArrivalTime: this.formatTime(employee.arrival_time),
      DepartureTime: this.formatTime(employee.leave_time)
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(wsData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, fileName);
  }

  saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(data, fileName);
  }
}
