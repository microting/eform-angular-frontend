import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NavigationMenuResetComponent } from './navigation-menu-reset.component';

describe('NavigationMenuResetComponent', () => {
  let component: NavigationMenuResetComponent;
  let fixture: ComponentFixture<NavigationMenuResetComponent>;
  let mockDialogRef: any;

  beforeEach(waitForAsync(() => {
    mockDialogRef = {
          close: jest.fn(),
        };

    TestBed.configureTestingModule({
      declarations: [ NavigationMenuResetComponent ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMenuResetComponent);
    component = fixture.componentInstance;
    // Don't call fixture.detectChanges() here - do it in individual tests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
