import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyConfigurationDeleteComponent } from './survey-configuration-delete.component';

describe('SurveyConfigurationDeleteComponent', () => {
  let component: SurveyConfigurationDeleteComponent;
  let fixture: ComponentFixture<SurveyConfigurationDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyConfigurationDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyConfigurationDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
