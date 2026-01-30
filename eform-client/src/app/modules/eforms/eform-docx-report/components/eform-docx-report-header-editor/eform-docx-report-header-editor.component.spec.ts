import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed  } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA , EventEmitter } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';
import { EformDocxReportHeaderEditorComponent } from './eform-docx-report-header-editor.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('EformDocxReportHeaderEditorComponent', () => {
  let component: EformDocxReportHeaderEditorComponent;
  let fixture: ComponentFixture<EformDocxReportHeaderEditorComponent>;

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
    const mockDialogRef = {
      close: vi.fn(),
    };
    
    await TestBed.configureTestingModule({
    imports: [FormsModule, EformDocxReportHeaderEditorComponent],
    declarations: [MockTranslatePipe],
    providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: TranslateService, useValue: mockTranslateService }
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EformDocxReportHeaderEditorComponent);
    component = fixture.componentInstance;
    // Don't call fixture.detectChanges() here - do it in individual tests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
