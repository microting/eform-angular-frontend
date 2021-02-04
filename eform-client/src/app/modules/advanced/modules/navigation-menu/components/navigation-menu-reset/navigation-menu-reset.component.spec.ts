import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavigationMenuResetComponent } from './navigation-menu-reset.component';

describe('NavigationMenuResetComponent', () => {
  let component: NavigationMenuResetComponent;
  let fixture: ComponentFixture<NavigationMenuResetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationMenuResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMenuResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
