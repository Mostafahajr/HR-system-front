import { TestBed } from '@angular/core/testing';

import { SalaryReportsService } from './salary-reports.service';

describe('SalaryReportsService', () => {
  let service: SalaryReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalaryReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
