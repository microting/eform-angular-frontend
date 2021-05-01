import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrdersSettingsComponent } from './workorders-settings.component';

describe('WorkordersSettingsComponent', () => {
  let component: WorkOrdersSettingsComponent;
  let fixture: ComponentFixture<WorkOrdersSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkOrdersSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrdersSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
