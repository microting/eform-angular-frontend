import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { NavigationMenuCustomDropdownComponent } from './navigation-menu-custom-dropdown.component';

describe('NavigationMenuCustomDropdownComponent', () => {
  let component: NavigationMenuCustomDropdownComponent;
  let fixture: ComponentFixture<NavigationMenuCustomDropdownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationMenuCustomDropdownComponent ],
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
