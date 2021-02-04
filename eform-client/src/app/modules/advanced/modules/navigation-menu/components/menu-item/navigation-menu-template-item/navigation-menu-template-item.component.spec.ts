import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavigationMenuTemplateItemComponent } from './navigation-menu-template-item.component';

describe('NavigationMenuTemplateItemComponent', () => {
  let component: NavigationMenuTemplateItemComponent;
  let fixture: ComponentFixture<NavigationMenuTemplateItemComponent>;

  beforeEach(waitForAsync(() => {
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
