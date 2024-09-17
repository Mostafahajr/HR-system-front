import { TestBed } from '@angular/core/testing';

import { HourRuleService } from './hour-rule.service';

describe('HourRuleService', () => {
  let service: HourRuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HourRuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
