import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailRecipientsTagsComponent } from './email-recipients-tags.component';

describe('EmailRecipientsTagsComponent', () => {
  let component: EmailRecipientsTagsComponent;
  let fixture: ComponentFixture<EmailRecipientsTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailRecipientsTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailRecipientsTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
