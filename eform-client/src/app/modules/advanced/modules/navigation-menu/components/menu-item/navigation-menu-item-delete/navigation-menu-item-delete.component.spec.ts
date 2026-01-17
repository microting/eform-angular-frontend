import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';

import { NavigationMenuItemDeleteComponent } from './navigation-menu-item-delete.component';

describe('NavigationMenuItemDeleteComponent', () => {
  let component: NavigationMenuItemDeleteComponent;
  let fixture: ComponentFixture<NavigationMenuItemDeleteComponent>;

  beforeEach(waitForAsync(() => {
    const mockDialogRef = {
      close: vi.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ NavigationMenuItemDeleteComponent, MockTranslatePipe ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { model: {}, firstLevelIndex: 0 } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMenuItemDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
