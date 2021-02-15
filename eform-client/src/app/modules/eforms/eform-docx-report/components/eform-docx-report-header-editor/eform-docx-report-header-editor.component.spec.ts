import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EformDocxReportHeaderEditorComponent } from './eform-docx-report-header-editor.component';

describe('EformDocxReportHeaderEditorComponent', () => {
  let component: EformDocxReportHeaderEditorComponent;
  let fixture: ComponentFixture<EformDocxReportHeaderEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EformDocxReportHeaderEditorComponent ]
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
