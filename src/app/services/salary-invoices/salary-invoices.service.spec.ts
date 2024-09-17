import { TestBed } from '@angular/core/testing';

import { SalaryInvoiceService } from './salary-invoices.service';

describe('SalaryInvoicesService', () => {
  let service: SalaryInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalaryInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
