import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EformDocxReportImagesComponent } from './eform-docx-report-images.component';

describe('EformDocxReportImagesComponent', () => {
  let component: EformDocxReportImagesComponent;
  let fixture: ComponentFixture<EformDocxReportImagesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EformDocxReportImagesComponent ]
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
