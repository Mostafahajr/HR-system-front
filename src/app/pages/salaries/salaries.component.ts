import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { SalaryReportsService } from '../../services/salary-reports/salary-reports.service';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';
import { IInvoice } from '../../models/iInvoice';
import { SalaryInvoiceService } from '../../services/salary-invoices/salary-invoices.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-salaries',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent,FormsModule,NgFor],
  templateUrl: './salaries.component.html',
  styleUrl: './salaries.component.scss',
})
export class SalariesComponent {
  response: any;

  constructor(private salaryReportsService: SalaryReportsService,
    private invoiceService: SalaryInvoiceService) { }

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


  /* 
  
  INVOICES CODING
  
  
  */
  invoices: IInvoice[] = [];
  oneInvoice: IInvoice = { id: '', name: '', description: '' }; // For showing one invoice
  showId: string = ''; // ID of the required invoice to be shown
  newInvoice: IInvoice = { id: '', name: '', description: '' }; // For adding a new invoice
  editedInvoice: IInvoice = { id: '', name: '', description: '' }; // For editing an invoice
  response2: any;

  // get all invoices
  getAllInvoices(): void {
    this.invoiceService.getAllSalaryInvoices().subscribe(
      (data) => {
        this.invoices = data;
      }
    );
  }
  // get one invoice
  getInvoiceById(invoiceId: string): void {
    this.invoiceService.getSalaryInvoiceById(invoiceId).subscribe(
      (data) => {
        this.oneInvoice = data;
        this.response2 = data;
      }
    );
  }
  // add a new invoice
  addInvoice(): void {
    this.invoiceService.addSalaryInvoice(this.newInvoice).subscribe(
      (data) => {
        this.getAllInvoices(); // Refresh the list
        this.newInvoice = { id: '', name: '', description: '' }; // Clear the form
        this.response2 = data;
      }
    );
  }
  // update an invoice
  updateInvoice(invoiceId: string): void {
    this.invoiceService.updateSalaryInvoice(invoiceId, this.editedInvoice).subscribe(
      (data) => {
        this.getAllInvoices(); // Refresh the list
        this.response2 = data;
      }
    );
  }
  // delete an invoice
  deleteInvoice(invoiceId: string): void {
    this.invoiceService.deleteSalaryInvoice(invoiceId).subscribe(
      (data) => {
        this.getAllInvoices(); // Refresh the list
        this.response2 = data;
      }
    );
  }
}






