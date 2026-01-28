import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed  } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { EmailRecipientEditComponent } from './email-recipient-edit.component';
import { EmailRecipientsService } from 'src/app/common/services';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslatePipe } from 'src/test-helpers';

describe('EmailRecipientEditComponent', () => {
  let component: EmailRecipientEditComponent;
  let fixture: ComponentFixture<EmailRecipientEditComponent>;

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
    const mockEmailRecipientsService = {
          update: vi.fn(),
        };
    const mockToastrService = {
          success: vi.fn(),
          error: vi.fn(),
        };
    const mockDialogRef = {
          close: vi.fn(),
        };
    const mockDialogData = {
      emailRecipientUpdateModel: {
        id: 1,
        name: 'Test',
        email: 'test@example.com',
        tags: []
      },
      availableTags: []
    };
    
    TestBed.configureTestingModule({
    imports: [FormsModule, EmailRecipientEditComponent],
    declarations: [MockTranslatePipe],
    providers: [
        { provide: EmailRecipientsService, useValue: mockEmailRecipientsService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailRecipientEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
