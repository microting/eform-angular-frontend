import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EformExcelReportHeaderEditorComponent } from './eform-excel-report-header-editor.component';

describe('EformExcelReportHeaderEditorComponent', () => {
  let component: EformExcelReportHeaderEditorComponent;
  let fixture: ComponentFixture<EformExcelReportHeaderEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EformExcelReportHeaderEditorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EformExcelReportHeaderEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
