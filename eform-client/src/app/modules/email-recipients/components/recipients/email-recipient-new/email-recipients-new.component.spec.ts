import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmailRecipientsNewComponent } from './email-recipients-new.component';

describe('EmailRecipientCreateComponent', () => {
  let component: EmailRecipientsNewComponent;
  let fixture: ComponentFixture<EmailRecipientsNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailRecipientsNewComponent ]
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
