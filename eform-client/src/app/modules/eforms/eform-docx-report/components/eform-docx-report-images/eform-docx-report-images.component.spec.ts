import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed  } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';
import { EformDocxReportImagesComponent } from './eform-docx-report-images.component';
import { TemplateFilesService } from 'src/app/common/services';
import { Gallery } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

describe('EformDocxReportImagesComponent', () => {
  let component: EformDocxReportImagesComponent;
  let fixture: ComponentFixture<EformDocxReportImagesComponent>;

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
    const mockGallery = {
      ref: vi.fn().mockReturnValue({
        load: vi.fn()
      })
    };
    const mockLightbox = {
      open: vi.fn()
    };
    const mockTemplateFilesService = {
      getImage: vi.fn().mockReturnValue(of(new Blob())),
      rotateImage: vi.fn().mockReturnValue(of({ success: true }))
    };

    TestBed.configureTestingModule({
    imports: [FormsModule, EformDocxReportImagesComponent],
    declarations: [MockTranslatePipe],
    providers: [
        { provide: Gallery, useValue: mockGallery },
        { provide: Lightbox, useValue: mockLightbox },
        { provide: TemplateFilesService, useValue: mockTemplateFilesService },
        { provide: TranslateService, useValue: mockTranslateService }
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EformDocxReportImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
