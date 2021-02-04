import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavigationMenuCustomComponent } from './navigation-menu-custom.component';

describe('NavigationMenuCustomComponent', () => {
  let component: NavigationMenuCustomComponent;
  let fixture: ComponentFixture<NavigationMenuCustomComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationMenuCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMenuCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
