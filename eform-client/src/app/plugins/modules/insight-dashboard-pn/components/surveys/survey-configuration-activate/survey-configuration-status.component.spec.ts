import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyConfigurationStatusComponent } from './survey-configuration-status.component';

describe('SurveyConfigurationActivateComponent', () => {
  let component: SurveyConfigurationStatusComponent;
  let fixture: ComponentFixture<SurveyConfigurationStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyConfigurationStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyConfigurationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
