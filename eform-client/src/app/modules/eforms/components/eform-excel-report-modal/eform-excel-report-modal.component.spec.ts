import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed  } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA , EventEmitter } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';
import { EformExcelReportModalComponent } from './eform-excel-report-modal.component';
import { EFormService } from 'src/app/common/services/eform';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

describe('EformExcelReportModalComponent', () => {
  let component: EformExcelReportModalComponent;
  let fixture: ComponentFixture<EformExcelReportModalComponent>;

  beforeEach(async () => {
    const mockTranslateService = {
      instant: vi.fn((key: string) => key),
      get: vi.fn((key: string) => of(key)),
      use: vi.fn(() => of(null)),
      setDefaultLang: vi.fn(),
      getDefaultLang: vi.fn(() => 'en'),
      addLangs: vi.fn(),
      getLangs: vi.fn(() => ['en']),
      getBrowserLang: vi.fn(() => 'en'),
      getBrowserCultureLang: vi.fn(() => 'en'),
      currentLang: 'en',
      defaultLang: 'en',
      stream: vi.fn((key: string) => of(key)),
      getParsedResult: vi.fn((translations: any, key: string) => key),
      getCurrentLang: vi.fn(() => 'en'),
      onLangChange: new EventEmitter(),
      onTranslationChange: new EventEmitter(),
      onDefaultLangChange: new EventEmitter()
    };
    const mockEFormService = {
      downloadEformExcel: vi.fn().mockReturnValue(of(new Blob())),
    };

    TestBed.configureTestingModule({
    imports: [FormsModule, EformExcelReportModalComponent],
    declarations: [MockTranslatePipe],
    providers: [
        { provide: EFormService, useValue: mockEFormService },
        FormBuilder,
        { provide: TranslateService, useValue: mockTranslateService }
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EformExcelReportModalComponent);
    component = fixture.componentInstance;
    // Don't call fixture.detectChanges() here - do it in individual tests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
