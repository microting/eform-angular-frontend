import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardChartEditComponent } from './dashboard-chart-edit.component';

describe('DashboardChartPreviewComponent', () => {
  let component: DashboardChartEditComponent;
  let fixture: ComponentFixture<DashboardChartEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardChartEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardChartEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
