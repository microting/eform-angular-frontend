import { ComponentFixture, TestBed  } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { EformDocxReportHeaderEditorComponent } from './eform-docx-report-header-editor.component';

describe('EformDocxReportHeaderEditorComponent', () => {
  let component: EformDocxReportHeaderEditorComponent;
  let fixture: ComponentFixture<EformDocxReportHeaderEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EformDocxReportHeaderEditorComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EformDocxReportHeaderEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
