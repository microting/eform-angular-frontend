import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMenuTreeComponent } from './navigation-menu-tree.component';

describe('NavigationMenuTreeComponent', () => {
  let component: NavigationMenuTreeComponent;
  let fixture: ComponentFixture<NavigationMenuTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationMenuTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMenuTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
