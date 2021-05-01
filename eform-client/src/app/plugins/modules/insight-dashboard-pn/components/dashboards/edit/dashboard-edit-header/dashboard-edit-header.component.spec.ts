import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEditHeaderComponent } from './dashboard-edit-header.component';

describe('DashboardEditHeaderComponent', () => {
  let component: DashboardEditHeaderComponent;
  let fixture: ComponentFixture<DashboardEditHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardEditHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardEditHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
