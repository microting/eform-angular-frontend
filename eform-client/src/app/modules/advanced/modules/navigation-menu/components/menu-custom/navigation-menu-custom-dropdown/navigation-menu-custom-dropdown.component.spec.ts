import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMenuCustomDropdownComponent } from './navigation-menu-custom-dropdown.component';

describe('NavigationMenuCustomDropdownComponent', () => {
  let component: NavigationMenuCustomDropdownComponent;
  let fixture: ComponentFixture<NavigationMenuCustomDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationMenuCustomDropdownComponent ]
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
