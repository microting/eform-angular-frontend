import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';
import { EformDocxReportImagesComponent } from './eform-docx-report-images.component';
import { TemplateFilesService } from 'src/app/common/services';
import { Gallery } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { of } from 'rxjs';

describe('EformDocxReportImagesComponent', () => {
  let component: EformDocxReportImagesComponent;
  let fixture: ComponentFixture<EformDocxReportImagesComponent>;

  beforeEach(waitForAsync(() => {
    const mockGallery = {
      ref: jest.fn().mockReturnValue({
        load: jest.fn()
      })
    };
    const mockLightbox = {
      open: jest.fn()
    };
    const mockTemplateFilesService = {
      getImage: jest.fn().mockReturnValue(of(new Blob())),
      rotateImage: jest.fn().mockReturnValue(of({ success: true }))
    };

    TestBed.configureTestingModule({
      declarations: [ EformDocxReportImagesComponent, MockTranslatePipe ],
      providers: [
        { provide: Gallery, useValue: mockGallery },
        { provide: Lightbox, useValue: mockLightbox },
        { provide: TemplateFilesService, useValue: mockTemplateFilesService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EformDocxReportImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
