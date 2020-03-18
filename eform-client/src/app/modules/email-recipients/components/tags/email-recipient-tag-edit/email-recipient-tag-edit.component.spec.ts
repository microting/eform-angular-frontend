import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailRecipientTagEditComponent } from './email-recipient-tag-edit.component';

describe('EmailRecipientTagEditComponent', () => {
  let component: EmailRecipientTagEditComponent;
  let fixture: ComponentFixture<EmailRecipientTagEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailRecipientTagEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailRecipientTagEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
