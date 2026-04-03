import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed  } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA , EventEmitter } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';
import { EformDocxReportHeaderComponent } from './eform-docx-report-header.component';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { provideNativeDateAdapter } from '@angular/material/core';

describe('EformDocxReportHeaderComponent', () => {
  let component: EformDocxReportHeaderComponent;
  let fixture: ComponentFixture<EformDocxReportHeaderComponent>;

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
    
    TestBed.configureTestingModule({
    imports: [FormsModule, EformDocxReportHeaderComponent],
    declarations: [MockTranslatePipe],
    providers: [
        provideNativeDateAdapter(),
        { provide: TranslateService, useValue: mockTranslateService }
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EformDocxReportHeaderComponent);
    component = fixture.componentInstance;
    // Don't call fixture.detectChanges() here - do it in individual tests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
