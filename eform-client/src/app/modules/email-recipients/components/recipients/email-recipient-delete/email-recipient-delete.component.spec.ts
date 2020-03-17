import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailRecipientDeleteComponent } from './email-recipient-delete.component';

describe('EmailRecipientDeleteComponent', () => {
  let component: EmailRecipientDeleteComponent;
  let fixture: ComponentFixture<EmailRecipientDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailRecipientDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailRecipientDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
