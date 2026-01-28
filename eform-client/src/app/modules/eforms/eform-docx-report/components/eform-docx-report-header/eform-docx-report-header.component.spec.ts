import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed  } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';
import { EformDocxReportHeaderComponent } from './eform-docx-report-header.component';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('EformDocxReportHeaderComponent', () => {
  let component: EformDocxReportHeaderComponent;
  let fixture: ComponentFixture<EformDocxReportHeaderComponent>;

  beforeEach(async () => {
    const mockTranslateService = {
      instant: vi.fn((key: string) => key),
      get: vi.fn((key: string) => of(key)),
      use: vi.fn(),
      setDefaultLang: vi.fn(),
      currentLang: 'en',
      stream: vi.fn()
    };
    mockTranslateService.stream.mockReturnValue(of('Test'));
    TestBed.configureTestingModule({
    imports: [FormsModule, EformDocxReportHeaderComponent],
    declarations: [MockTranslatePipe],
    providers: [
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
