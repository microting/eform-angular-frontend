import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardChartViewComponent } from './dashboard-chart-view.component';

describe('DashboardChartComponent', () => {
  let component: DashboardChartViewComponent;
  let fixture: ComponentFixture<DashboardChartViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardChartViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardChartViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
