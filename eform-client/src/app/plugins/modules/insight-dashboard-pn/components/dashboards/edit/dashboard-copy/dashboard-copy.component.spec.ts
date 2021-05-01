import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCopyComponent } from './dashboard-copy.component';

describe('DashboardCopyComponent', () => {
  let component: DashboardCopyComponent;
  let fixture: ComponentFixture<DashboardCopyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardCopyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
