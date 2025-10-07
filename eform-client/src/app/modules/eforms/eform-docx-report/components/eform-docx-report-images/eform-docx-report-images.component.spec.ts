import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { EformDocxReportImagesComponent } from './eform-docx-report-images.component';

describe('EformDocxReportImagesComponent', () => {
  let component: EformDocxReportImagesComponent;
  let fixture: ComponentFixture<EformDocxReportImagesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EformDocxReportImagesComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EformDocxReportImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
