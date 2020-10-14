import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMenuTemplatesComponent } from './navigation-menu-templates.component';

describe('NavigationMenuTemplatesComponent', () => {
  let component: NavigationMenuTemplatesComponent;
  let fixture: ComponentFixture<NavigationMenuTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationMenuTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMenuTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
