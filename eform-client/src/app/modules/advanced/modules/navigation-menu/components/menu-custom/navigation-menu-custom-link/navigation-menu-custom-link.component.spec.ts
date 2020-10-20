import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMenuCustomLinkComponent } from './navigation-menu-custom-link.component';

describe('NavigationMenuCustomLinkComponent', () => {
  let component: NavigationMenuCustomLinkComponent;
  let fixture: ComponentFixture<NavigationMenuCustomLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationMenuCustomLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMenuCustomLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
