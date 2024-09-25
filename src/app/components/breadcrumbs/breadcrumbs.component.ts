import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumbs.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import * as XLSX from 'xlsx';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component'; // Adjust the path if necessary

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  imports: [CommonModule, RouterLink, RouterModule, MatIcon, MatIconModule, MatButton]
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  breadcrumbs: Array<{ label: string; url: string }> = [];
  private routerEventsSubscription: any;
  fileName: string = '';
  sectionName: string = '';
  date: string = '';
  errorMessage: string = '';

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Subscribe to router events to update breadcrumbs on route change
    this.routerEventsSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBreadcrumbs();
      });

    // Initial update
    this.updateBreadcrumbs();
  }

  ngOnDestroy(): void {
    // Clean up the subscription
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }

  updateBreadcrumbs(): void {
    // Update the breadcrumbs based on the current route
    this.breadcrumbs = this.breadcrumbService.breadcrumbs;
  }

  // For navigation of any button next to breadcrumb
  navigate(route: string): void {
    this.router.navigate([route]);
  }

  // File input logic
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.errorMessage = '';

    if (file) {
      this.fileName = file.name;

      // Regex to match the desired format and extract section name and date
      const regex = /^(.*)_(\d{4}-\d{2}-\d{2})/;
      const matches = this.fileName.match(regex);

      if (matches) {
        this.sectionName = matches[1].trim(); // Extract section name and trim spaces
        this.date = matches[2]; // Extract date

        const dialogRef = this.dialog.open(ImportDialogComponent, {
          width: '400px',
          data: { sectionName: this.sectionName, date: this.date, fileName: this.fileName }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result?.confirmed) {
            this.processExcelFile(file);
          }
        });
      } else {
        this.errorMessage = 'Invalid file name format. Please ensure it follows the correct naming convention.';
      }
    }
  }


  processExcelFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length > 1) {
        const formattedData = jsonData.slice(1).map((row: any[]) => {
          const attendanceId = row[0] || null; // New column for attendance ID
          const employeeName = row[1];
          const attendance = this.parseTime(row[2]) || '00:00';
          const departure = this.parseTime(row[3]) || '12:00';

          return {
            employeeId: attendanceId, // Include attendance ID
            departmentName: this.sectionName,
            date: this.date,
            employeeName: employeeName || 'Unknown',
            attendance: attendance,
            departure: departure
          };
        });

        this.router.navigate(['attendance-reports/create'], { state: { data: formattedData } });
      } else {
        this.errorMessage = 'The input file is empty.';
      }
    };
    reader.readAsArrayBuffer(file);
  }
  // Helper function to parse time values from HH:MM format
  private parseTime(value: any): string | null {
    if (!value) return null; // Return null if value is empty

    // If value is a number (Excel format), convert it to time string
    if (typeof value === 'number') {
      const date = new Date(value * 86400000); // Convert Excel date to JavaScript date
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`; // Format as HH:MM without seconds
    }

    // If value is a string, return as-is after trimming
    return value.toString().trim(); // Handle case for direct HH:MM string
  }

}
