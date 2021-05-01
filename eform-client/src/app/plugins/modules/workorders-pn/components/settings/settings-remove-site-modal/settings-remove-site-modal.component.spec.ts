import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsRemoveSiteModalComponent } from './settings-remove-site-modal.component';

describe('SettingsRemoveSiteModalComponent', () => {
  let component: SettingsRemoveSiteModalComponent;
  let fixture: ComponentFixture<SettingsRemoveSiteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsRemoveSiteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsRemoveSiteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
