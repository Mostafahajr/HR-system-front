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
  ) {}

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

        const nameParts = file.name.split('_');
        this.sectionName = nameParts[0] || '';

        // Extract the date and ignore any trailing characters like (1)
        const datePart = nameParts[1]?.split('.')[0] || '';
        const dateMatch = datePart.match(/(\d{4}-\d{1,2}-\d{1,2})/); // Match format YYYY-MM-DD
        this.date = dateMatch ? dateMatch[0] : ''; // Extract the date if matched

        const dialogRef = this.dialog.open(ImportDialogComponent, {
            width: '400px',
            data: { sectionName: this.sectionName, date: this.date, fileName: this.fileName }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result?.confirmed) {
                this.processExcelFile(file);
            }
        });
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

      // Convert data to required JSON format
      const formattedData = jsonData.slice(1).map((row: any[]) => ({
        departmentName: this.sectionName,
        date: this.date,
        employeeName: row[0], // Adjust based on actual column
        attendance: row[1], // Adjust based on actual column
        departure: row[2] // Adjust based on actual column
      }));

      // Navigate to the Add Attendance page with the formatted data
      this.router.navigate(['attendance-reports/create'], { state: { data: formattedData } });
    };
    reader.readAsArrayBuffer(file);
  }
}
