import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardInterviewsEditComponent } from './dashboard-interviews-edit.component';

describe('DashboardInterviewsEditComponent', () => {
  let component: DashboardInterviewsEditComponent;
  let fixture: ComponentFixture<DashboardInterviewsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardInterviewsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardInterviewsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
