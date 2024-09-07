import { TestBed } from '@angular/core/testing';

import { GeneralRulesService } from './general-rules.service';

describe('GeneralRulesService', () => {
  let service: GeneralRulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralRulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
