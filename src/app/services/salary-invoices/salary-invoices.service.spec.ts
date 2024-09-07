import { TestBed } from '@angular/core/testing';

import { SalaryInvoicesService } from './salary-invoices.service';

describe('SalaryInvoicesService', () => {
  let service: SalaryInvoicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalaryInvoicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
