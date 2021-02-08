import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavigationMenuItemEditComponent } from './navigation-menu-item-edit.component';

describe('NavigationMenuItemEditComponent', () => {
  let component: NavigationMenuItemEditComponent;
  let fixture: ComponentFixture<NavigationMenuItemEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationMenuItemEditComponent ]
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
