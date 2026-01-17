import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { EmailRecipientsNewComponent } from './email-recipients-new.component';
import { EmailRecipientsService } from 'src/app/common/services';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslatePipe } from 'src/test-helpers';

describe('EmailRecipientCreateComponent', () => {
  let component: EmailRecipientsNewComponent;
  let fixture: ComponentFixture<EmailRecipientsNewComponent>;

  beforeEach(waitForAsync(() => {
    const mockEmailRecipientsService = {
          create: vi.fn(),
        };
    const mockToastrService = {
          success: vi.fn(),
          error: vi.fn(),
        };
    const mockTranslateService = {
          instant: vi.fn(),
        };
    const mockDialogRef = {
          close: vi.fn(),
        };
    
    TestBed.configureTestingModule({
    imports: [FormsModule, EmailRecipientsNewComponent],
    declarations: [MockTranslatePipe],
    providers: [
        { provide: EmailRecipientsService, useValue: mockEmailRecipientsService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: [] }
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailRecipientsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
