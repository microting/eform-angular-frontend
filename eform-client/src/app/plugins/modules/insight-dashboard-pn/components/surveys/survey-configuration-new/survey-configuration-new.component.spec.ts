import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyConfigurationNewComponent } from './survey-configuration-new.component';

describe('SurveyConfigurationNewComponent', () => {
  let component: SurveyConfigurationNewComponent;
  let fixture: ComponentFixture<SurveyConfigurationNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyConfigurationNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyConfigurationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
