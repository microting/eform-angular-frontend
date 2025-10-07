import { ComponentFixture, TestBed  } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';
import { EformDocxReportHeaderEditorComponent } from './eform-docx-report-header-editor.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('EformDocxReportHeaderEditorComponent', () => {
  let component: EformDocxReportHeaderEditorComponent;
  let fixture: ComponentFixture<EformDocxReportHeaderEditorComponent>;

  beforeEach(async () => {
    const mockDialogRef = {
      close: jest.fn(),
    };
    
    await TestBed.configureTestingModule({
      declarations: [ EformDocxReportHeaderEditorComponent, MockTranslatePipe ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
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
