import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMenuTemplateItemComponent } from './navigation-menu-template-item.component';

describe('NavigationMenuTemplateItemComponent', () => {
  let component: NavigationMenuTemplateItemComponent;
  let fixture: ComponentFixture<NavigationMenuTemplateItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationMenuTemplateItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationMenuTemplateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
