import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyConfigurationEditComponent } from './survey-configuration-edit.component';

describe('SurveyConfigurationEditComponent', () => {
  let component: SurveyConfigurationEditComponent;
  let fixture: ComponentFixture<SurveyConfigurationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyConfigurationEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyConfigurationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
