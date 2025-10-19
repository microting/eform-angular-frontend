import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';

import { NavigationMenuItemEditComponent } from './navigation-menu-item-edit.component';

describe('NavigationMenuItemEditComponent', () => {
  let component: NavigationMenuItemEditComponent;
  let fixture: ComponentFixture<NavigationMenuItemEditComponent>;

  beforeEach(waitForAsync(() => {
    const mockDialogRef = {
      close: jest.fn(),
    };

    TestBed.configureTestingModule({
      declarations: [ NavigationMenuItemEditComponent, MockTranslatePipe ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { model: { translations: [] }, firstLevelIndex: 0, securityGroups: [] } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMenuItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
