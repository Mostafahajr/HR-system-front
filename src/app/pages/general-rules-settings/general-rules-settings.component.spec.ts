import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralRulesSettingsComponent } from './general-rules-settings.component';

describe('GeneralRulesSettingsComponent', () => {
  let component: GeneralRulesSettingsComponent;
  let fixture: ComponentFixture<GeneralRulesSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralRulesSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralRulesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
