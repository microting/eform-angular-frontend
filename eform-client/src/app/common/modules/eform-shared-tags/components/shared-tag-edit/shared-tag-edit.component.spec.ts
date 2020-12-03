import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTagEditComponent } from './shared-tag-edit.component';

describe('EmailRecipientTagEditComponent', () => {
  let component: SharedTagEditComponent;
  let fixture: ComponentFixture<SharedTagEditComponent>;

  beforeEach(async(() => {
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
