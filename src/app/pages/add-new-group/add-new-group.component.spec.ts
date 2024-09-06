import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewGroupComponent } from './add-new-group.component';

describe('AddNewGroupComponent', () => {
  let component: AddNewGroupComponent;
  let fixture: ComponentFixture<AddNewGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
