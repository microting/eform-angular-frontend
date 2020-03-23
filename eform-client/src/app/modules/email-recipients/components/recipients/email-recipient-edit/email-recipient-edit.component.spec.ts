import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailRecipientEditComponent } from './email-recipient-edit.component';

describe('EmailRecipientEditComponent', () => {
  let component: EmailRecipientEditComponent;
  let fixture: ComponentFixture<EmailRecipientEditComponent>;

  beforeEach(async(() => {
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
