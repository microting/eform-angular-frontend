import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EmailRecipientEditComponent } from './email-recipient-edit.component';
import { EmailRecipientsService } from 'src/app/common/services';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslatePipe } from 'src/test-helpers';

describe('EmailRecipientEditComponent', () => {
  let component: EmailRecipientEditComponent;
  let fixture: ComponentFixture<EmailRecipientEditComponent>;

  beforeEach(waitForAsync(() => {
    const mockEmailRecipientsService = {
          update: jest.fn(),
        };
    const mockToastrService = {
          success: jest.fn(),
          error: jest.fn(),
        };
    const mockTranslateService = {
          instant: jest.fn(),
        };
    const mockDialogRef = {
          close: jest.fn(),
        };
    
    TestBed.configureTestingModule({
      declarations: [ EmailRecipientEditComponent, MockTranslatePipe ],
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailRecipientEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
