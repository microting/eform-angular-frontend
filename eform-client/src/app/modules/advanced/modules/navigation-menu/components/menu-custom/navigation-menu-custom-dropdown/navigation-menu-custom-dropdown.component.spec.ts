import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';

import { NavigationMenuCustomDropdownComponent } from './navigation-menu-custom-dropdown.component';

describe('NavigationMenuCustomDropdownComponent', () => {
  let component: NavigationMenuCustomDropdownComponent;
  let fixture: ComponentFixture<NavigationMenuCustomDropdownComponent>;

  beforeEach(waitForAsync(() => {
    const mockDialogRef = {
      close: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ NavigationMenuCustomDropdownComponent, MockTranslatePipe ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: [] }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMenuCustomDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
