import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { EformDocxReportTableComponent } from './eform-docx-report-table.component';

describe('EformDocxReportTableComponent', () => {
  let component: EformDocxReportTableComponent;
  let fixture: ComponentFixture<EformDocxReportTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EformDocxReportTableComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EformDocxReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
