import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmailRecipientEditComponent } from './email-recipient-edit.component';

describe('EmailRecipientEditComponent', () => {
  let component: EmailRecipientEditComponent;
  let fixture: ComponentFixture<EmailRecipientEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailRecipientEditComponent ]
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
