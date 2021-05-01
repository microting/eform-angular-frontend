import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDeleteComponent } from './dashboard-delete.component';

describe('DashboardDeleteComponent', () => {
  let component: DashboardDeleteComponent;
  let fixture: ComponentFixture<DashboardDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
