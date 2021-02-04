import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SharedTagEditComponent } from './shared-tag-edit.component';

describe('EmailRecipientTagEditComponent', () => {
  let component: SharedTagEditComponent;
  let fixture: ComponentFixture<SharedTagEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedTagEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTagEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
