import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InstalledPluginPermissionsComponent } from './installed-plugin-permissions.component';

describe('InstalledPluginPermissionsComponent', () => {
  let component: InstalledPluginPermissionsComponent;
  let fixture: ComponentFixture<InstalledPluginPermissionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InstalledPluginPermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstalledPluginPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
