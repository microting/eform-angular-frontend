import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed  } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA , EventEmitter } from '@angular/core';
import { of } from 'rxjs';

import { EmailRecipientDeleteComponent } from './email-recipient-delete.component';
import { EmailRecipientsService } from 'src/app/common/services';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslatePipe } from 'src/test-helpers';

describe('EmailRecipientDeleteComponent', () => {
  let component: EmailRecipientDeleteComponent;
  let fixture: ComponentFixture<EmailRecipientDeleteComponent>;

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
    const mockEmailRecipientsService = {
          delete: vi.fn(),
        };
    const mockToastrService = {
          success: vi.fn(),
          error: vi.fn(),
        };
    const mockDialogRef = {
          close: vi.fn(),
        };
    
    TestBed.configureTestingModule({
    imports: [FormsModule, EmailRecipientDeleteComponent],
    declarations: [MockTranslatePipe],
    providers: [
        { provide: EmailRecipientsService, useValue: mockEmailRecipientsService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} }
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailRecipientDeleteComponent);
    component = fixture.componentInstance;
    // Don't call fixture.detectChanges() here - do it in individual tests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
