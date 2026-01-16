import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';
import { EformDocxReportContainerComponent } from './eform-docx-report-container.component';
import { TranslateService } from '@ngx-translate/core';
import { EmailRecipientsService, EformDocxReportService } from 'src/app/common/services';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

describe('EformDocxReportContainerComponent', () => {
  let component: EformDocxReportContainerComponent;
  let fixture: ComponentFixture<EformDocxReportContainerComponent>;

  beforeEach(waitForAsync(() => {
    const mockTranslateService = {
      instant: vi.fn()
    };
    const mockEmailRecipientsService = {
      getAll: vi.fn()
    };
    const mockEformDocxReportService = {
      get: vi.fn()
    };
    const mockRouter = {
      navigate: vi.fn()
    };
    const mockActivatedRoute = {
      params: { subscribe: vi.fn() }
    };
    const mockToastrService = {
      success: vi.fn(),
      error: vi.fn()
    };
    
    TestBed.configureTestingModule({
      declarations: [ EformDocxReportContainerComponent, MockTranslatePipe ],
      providers: [
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: EmailRecipientsService, useValue: mockEmailRecipientsService },
        { provide: EformDocxReportService, useValue: mockEformDocxReportService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ToastrService, useValue: mockToastrService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EformDocxReportContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
