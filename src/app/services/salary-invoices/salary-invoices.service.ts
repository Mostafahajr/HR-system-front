import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IInvoice } from '../../models/iInvoice'; // Adjust this import based on your actual data model

@Injectable({
  providedIn: 'root',
})
export class SalaryInvoiceService {
  private apiUrl = 'http://localhost:3005/salary-invoices'; // Updated endpoint

  constructor(public http: HttpClient) { }

  // get all
  getAllSalaryInvoices(): Observable<IInvoice[]> {
    return this.http.get<IInvoice[]>(`${this.apiUrl}`);
  }
  // get one
  getSalaryInvoiceById(invoiceId: string): Observable<IInvoice> {
    return this.http.get<IInvoice>(`${this.apiUrl}/${invoiceId}`);
  }
  // add one
  addSalaryInvoice(invoice: IInvoice): Observable<any> {
    return this.http.post(`${this.apiUrl}`, invoice);
  }
  // update one
  updateSalaryInvoice(invoiceId: string, invoice: IInvoice): Observable<any> { 
    return this.http.put(`${this.apiUrl}/${invoiceId}`, invoice);
  }
  // delete one
  deleteSalaryInvoice(invoiceId: string): Observable<any> {
    return this.http.delete<void>(`${this.apiUrl}/${invoiceId}`);
  }
}
