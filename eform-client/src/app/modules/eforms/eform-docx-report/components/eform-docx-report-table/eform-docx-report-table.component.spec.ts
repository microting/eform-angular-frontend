import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed  } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslatePipe } from 'src/test-helpers';
import { EformDocxReportTableComponent } from './eform-docx-report-table.component';
import { of } from 'rxjs';

describe('EformDocxReportTableComponent', () => {
  let component: EformDocxReportTableComponent;
  let fixture: ComponentFixture<EformDocxReportTableComponent>;

  beforeEach(async () => {
    const mockTranslateService = {
      instant: vi.fn((key: string) => key),
      get: vi.fn((key: string) => of(key)),
      use: vi.fn(),
      setDefaultLang: vi.fn(),
      currentLang: 'en',
      stream: vi.fn((key: string) => key)
    };
    const mockRouter = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
    imports: [FormsModule, EformDocxReportTableComponent],
    declarations: [MockTranslatePipe],
    providers: [
        { provide: Router, useValue: mockRouter },
        { provide: TranslateService, useValue: mockTranslateService }
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EformDocxReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
