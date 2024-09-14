import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekendSettingsComponent } from './weekend-settings.component';

describe('WeekendSettingsComponent', () => {
  let component: WeekendSettingsComponent;
  let fixture: ComponentFixture<WeekendSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekendSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekendSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
