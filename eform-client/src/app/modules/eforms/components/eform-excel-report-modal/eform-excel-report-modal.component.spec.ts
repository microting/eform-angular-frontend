import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';
import { EformExcelReportModalComponent } from './eform-excel-report-modal.component';
import { EFormService } from 'src/app/common/services/eform';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

describe('EformExcelReportModalComponent', () => {
  let component: EformExcelReportModalComponent;
  let fixture: ComponentFixture<EformExcelReportModalComponent>;

  beforeEach(waitForAsync(() => {
    const mockEFormService = {
      downloadEformExcel: jest.fn().mockReturnValue(of(new Blob())),
    };

    TestBed.configureTestingModule({
      declarations: [ EformExcelReportModalComponent, MockTranslatePipe ],
      providers: [
        { provide: EFormService, useValue: mockEFormService },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EformExcelReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
