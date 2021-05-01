import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardInterviewsViewComponent } from './dashboard-interviews-view.component';

describe('DashboardInterviewsViewComponent', () => {
  let component: DashboardInterviewsViewComponent;
  let fixture: ComponentFixture<DashboardInterviewsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardInterviewsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardInterviewsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
