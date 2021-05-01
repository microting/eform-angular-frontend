import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrdersPageComponent } from './workorders-page.component';

describe('WorkordersPageComponent', () => {
  let component: WorkOrdersPageComponent;
  let fixture: ComponentFixture<WorkOrdersPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkOrdersPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrdersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
