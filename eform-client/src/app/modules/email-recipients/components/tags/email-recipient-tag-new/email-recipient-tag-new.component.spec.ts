import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailRecipientTagNewComponent } from './email-recipient-tag-new.component';

describe('EmailRecipientTagNewComponent', () => {
  let component: EmailRecipientTagNewComponent;
  let fixture: ComponentFixture<EmailRecipientTagNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailRecipientTagNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailRecipientTagNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
