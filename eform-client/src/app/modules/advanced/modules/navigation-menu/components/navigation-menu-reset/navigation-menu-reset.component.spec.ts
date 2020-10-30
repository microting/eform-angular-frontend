import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMenuResetComponent } from './navigation-menu-reset.component';

describe('NavigationMenuResetComponent', () => {
  let component: NavigationMenuResetComponent;
  let fixture: ComponentFixture<NavigationMenuResetComponent>;

  beforeEach(async(() => {
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
