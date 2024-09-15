import { TestBed } from '@angular/core/testing';

import { PrivilegeServiceService } from './privilege-service.service';

describe('PrivilegeServiceService', () => {
  let service: PrivilegeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrivilegeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
