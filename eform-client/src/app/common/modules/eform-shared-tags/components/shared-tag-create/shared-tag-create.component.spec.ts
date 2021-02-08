import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SharedTagCreateComponent } from './shared-tag-create.component';

describe('EmailRecipientTagNewComponent', () => {
  let component: SharedTagCreateComponent;
  let fixture: ComponentFixture<SharedTagCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedTagCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTagCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
