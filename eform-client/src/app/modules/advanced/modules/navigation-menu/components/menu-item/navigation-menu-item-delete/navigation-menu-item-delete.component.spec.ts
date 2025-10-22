import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';

import { NavigationMenuItemDeleteComponent } from './navigation-menu-item-delete.component';

describe('NavigationMenuItemDeleteComponent', () => {
  let component: NavigationMenuItemDeleteComponent;
  let fixture: ComponentFixture<NavigationMenuItemDeleteComponent>;

  beforeEach(waitForAsync(() => {
    const mockDialogRef = {
      close: jest.fn(),
    };

    TestBed.configureTestingModule({
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
