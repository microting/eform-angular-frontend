import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SharedTagDeleteComponent } from './shared-tag-delete.component';

describe('EmailRecipientTagDeleteComponent', () => {
  let component: SharedTagDeleteComponent;
  let fixture: ComponentFixture<SharedTagDeleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedTagDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTagDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
