import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsAddSiteModalComponent } from './settings-add-site-modal.component';

describe('SettingsAddSiteModalComponent', () => {
  let component: SettingsAddSiteModalComponent;
  let fixture: ComponentFixture<SettingsAddSiteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsAddSiteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsAddSiteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
