import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryRelatedSettingsComponent } from './salary-related-settings.component';

describe('SalaryRelatedSettingsComponent', () => {
  let component: SalaryRelatedSettingsComponent;
  let fixture: ComponentFixture<SalaryRelatedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryRelatedSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryRelatedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
