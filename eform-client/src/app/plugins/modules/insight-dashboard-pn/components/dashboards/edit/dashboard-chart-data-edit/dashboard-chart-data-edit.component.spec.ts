import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardChartDataEditComponent } from './dashboard-chart-data-edit.component';

describe('DashboardChartDataEditComponent', () => {
  let component: DashboardChartDataEditComponent;
  let fixture: ComponentFixture<DashboardChartDataEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardChartDataEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardChartDataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
