import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailRecipientTagDeleteComponent } from './email-recipient-tag-delete.component';

describe('EmailRecipientTagDeleteComponent', () => {
  let component: EmailRecipientTagDeleteComponent;
  let fixture: ComponentFixture<EmailRecipientTagDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailRecipientTagDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailRecipientTagDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
