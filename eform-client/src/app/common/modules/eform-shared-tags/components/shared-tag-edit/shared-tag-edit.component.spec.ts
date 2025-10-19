import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';

import { SharedTagEditComponent } from './shared-tag-edit.component';

describe('EmailRecipientTagEditComponent', () => {
  let component: SharedTagEditComponent;
  let fixture: ComponentFixture<SharedTagEditComponent>;

  beforeEach(waitForAsync(() => {
    const mockDialogRef = {
      close: jest.fn(),
    };

    TestBed.configureTestingModule({
      declarations: [ SharedTagEditComponent, MockTranslatePipe ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
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
