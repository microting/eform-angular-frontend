import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningAssignSitesModalComponent } from './planning-folders-modal.component';

describe('PlanningAssignSitesModalComponent', () => {
  let component: PlanningAssignSitesModalComponent;
  let fixture: ComponentFixture<PlanningAssignSitesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningAssignSitesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningAssignSitesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
