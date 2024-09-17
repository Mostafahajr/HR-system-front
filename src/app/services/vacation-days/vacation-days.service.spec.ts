import { TestBed } from '@angular/core/testing';

import { VacationDaysService } from './vacation-days.service';

describe('VacationDaysService', () => {
  let service: VacationDaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VacationDaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
