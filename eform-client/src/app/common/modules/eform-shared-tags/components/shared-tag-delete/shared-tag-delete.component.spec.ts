import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';

import { SharedTagDeleteComponent } from './shared-tag-delete.component';

describe('EmailRecipientTagDeleteComponent', () => {
  let component: SharedTagDeleteComponent;
  let fixture: ComponentFixture<SharedTagDeleteComponent>;

  beforeEach(waitForAsync(() => {
    const mockDialogRef = {
      close: jest.fn()
    };
    
    TestBed.configureTestingModule({
      declarations: [ SharedTagDeleteComponent, MockTranslatePipe ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
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
