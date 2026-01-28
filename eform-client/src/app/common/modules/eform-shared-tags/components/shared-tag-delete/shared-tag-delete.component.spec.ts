import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed  } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';

import { SharedTagDeleteComponent } from './shared-tag-delete.component';

describe('EmailRecipientTagDeleteComponent', () => {
  let component: SharedTagDeleteComponent;
  let fixture: ComponentFixture<SharedTagDeleteComponent>;

  beforeEach(async () => {
    const mockDialogRef = {
      close: vi.fn()
    };
    
    TestBed.configureTestingModule({
    imports: [FormsModule, SharedTagDeleteComponent],
    declarations: [MockTranslatePipe],
    providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} }
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTagDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
