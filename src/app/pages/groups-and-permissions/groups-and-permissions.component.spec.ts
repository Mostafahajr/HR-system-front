import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsAndPermissionsComponent } from './groups-and-permissions.component';

describe('GroupsAndPermissionsComponent', () => {
  let component: GroupsAndPermissionsComponent;
  let fixture: ComponentFixture<GroupsAndPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupsAndPermissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupsAndPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
