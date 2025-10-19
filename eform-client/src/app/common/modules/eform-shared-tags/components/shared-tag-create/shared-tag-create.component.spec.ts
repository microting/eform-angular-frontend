import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';

import { SharedTagCreateComponent } from './shared-tag-create.component';

describe('EmailRecipientTagNewComponent', () => {
  let component: SharedTagCreateComponent;
  let fixture: ComponentFixture<SharedTagCreateComponent>;

  beforeEach(waitForAsync(() => {
    const mockDialogRef = {
      close: jest.fn(),
    };

    TestBed.configureTestingModule({
      declarations: [ SharedTagCreateComponent, MockTranslatePipe ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef }
      ],
      schemas: [NO_ERRORS_SCHEMA]
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
