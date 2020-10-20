import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMenuCustomComponent } from './navigation-menu-custom.component';

describe('NavigationMenuCustomComponent', () => {
  let component: NavigationMenuCustomComponent;
  let fixture: ComponentFixture<NavigationMenuCustomComponent>;

  beforeEach(async(() => {
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
