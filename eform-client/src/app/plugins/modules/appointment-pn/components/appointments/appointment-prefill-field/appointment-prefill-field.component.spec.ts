import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentPrefillFieldComponent } from './appointment-prefill-field.component';

describe('AppointmentPrefillFieldComponent', () => {
  let component: AppointmentPrefillFieldComponent;
  let fixture: ComponentFixture<AppointmentPrefillFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentPrefillFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentPrefillFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
