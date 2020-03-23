import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailRecipientsPageComponent } from './email-recipients-page.component';

describe('EmailRecipientsPageComponent', () => {
  let component: EmailRecipientsPageComponent;
  let fixture: ComponentFixture<EmailRecipientsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailRecipientsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailRecipientsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
