import { TestBed } from '@angular/core/testing';

import { GroupsAndPermissionsService } from './groups-and-permissions.service';

describe('GroupsAndPermissionsService', () => {
  let service: GroupsAndPermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupsAndPermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
