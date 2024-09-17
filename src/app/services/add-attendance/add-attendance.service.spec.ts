import { TestBed } from '@angular/core/testing';

import { AddAttendanceService } from './add-attendance.service';

describe('AddAttendanceService', () => {
  let service: AddAttendanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddAttendanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
