import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslatePipe } from 'src/test-helpers';
import { EformDocxReportTableComponent } from './eform-docx-report-table.component';

describe('EformDocxReportTableComponent', () => {
  let component: EformDocxReportTableComponent;
  let fixture: ComponentFixture<EformDocxReportTableComponent>;

  beforeEach(waitForAsync(() => {
    const mockRouter = {
      navigate: jest.fn(),
    };
    const mockTranslateService = {
      stream: jest.fn((key: string) => key),
      instant: jest.fn((key: string) => key),
    };

    TestBed.configureTestingModule({
      declarations: [ EformDocxReportTableComponent, MockTranslatePipe ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: TranslateService, useValue: mockTranslateService }
      ],
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
