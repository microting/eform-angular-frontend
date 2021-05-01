import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBlockViewComponent } from './dashboard-block-view.component';

describe('DashboardBlockViewComponent', () => {
  let component: DashboardBlockViewComponent;
  let fixture: ComponentFixture<DashboardBlockViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardBlockViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardBlockViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
