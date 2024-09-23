import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeExcelComponent } from './employee-excel.component';

describe('EmployeeExcelComponent', () => {
  let component: EmployeeExcelComponent;
  let fixture: ComponentFixture<EmployeeExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeExcelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
