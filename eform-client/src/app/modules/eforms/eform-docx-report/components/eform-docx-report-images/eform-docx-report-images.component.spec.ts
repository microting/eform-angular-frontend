import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EformDocxReportImagesComponent } from './eform-docx-report-images.component';

describe('EformDocxReportImagesComponent', () => {
  let component: EformDocxReportImagesComponent;
  let fixture: ComponentFixture<EformDocxReportImagesComponent>;

  beforeEach(async(() => {
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
