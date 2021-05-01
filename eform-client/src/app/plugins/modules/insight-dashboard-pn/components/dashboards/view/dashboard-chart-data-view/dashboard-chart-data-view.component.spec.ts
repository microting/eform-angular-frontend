import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardChartDataViewComponent } from './dashboard-chart-data-view.component';

describe('DashboardChartDataViewComponent', () => {
  let component: DashboardChartDataViewComponent;
  let fixture: ComponentFixture<DashboardChartDataViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardChartDataViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardChartDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
