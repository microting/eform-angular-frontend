import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyConfigurationsPageComponent } from './survey-configurations-page.component';

describe('InsightDashboardSurveysComponent', () => {
  let component: SurveyConfigurationsPageComponent;
  let fixture: ComponentFixture<SurveyConfigurationsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyConfigurationsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyConfigurationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
