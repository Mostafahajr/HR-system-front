import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';


@Component({
  selector: 'app-import-dialog',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule ,MatSelectModule ,MatDialogModule ,ReactiveFormsModule ,MatButton],
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss']
})
export class ImportDialogComponent {
  sectionName: string;
  date: string;
  fileName: string;
  sections: string[] = ['Section 1', 'Section 2', 'Section 3']; // Example sections
  sectionControl = new FormControl(); // Initialize FormControl for mat-select

  constructor(
    private dialogRef: MatDialogRef<ImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Initialize properties with the data passed to the dialog
    this.sectionName = data.sectionName;
    this.date = data.date;
    this.fileName = data.fileName;
  }

  confirmImport(): void {
    this.dialogRef.close({ confirmed: true, sectionName: this.sectionName, date: this.date });
  }

  close(): void {
    this.dialogRef.close();
  }
}
