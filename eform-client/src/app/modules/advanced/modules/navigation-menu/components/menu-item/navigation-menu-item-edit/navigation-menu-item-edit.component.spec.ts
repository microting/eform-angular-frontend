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

  it('should display icon preview when icon is set', () => {
    component.item.icon = 'home';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const iconPreview = compiled.querySelector('#editIconPreview');
    
    expect(iconPreview).toBeTruthy();
    expect(iconPreview.textContent.trim()).toBe('home');
  });

  it('should not display icon preview when icon is not set', () => {
    component.item.icon = '';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const iconPreview = compiled.querySelector('#editIconPreview');
    
    expect(iconPreview).toBeFalsy();
  });
});
