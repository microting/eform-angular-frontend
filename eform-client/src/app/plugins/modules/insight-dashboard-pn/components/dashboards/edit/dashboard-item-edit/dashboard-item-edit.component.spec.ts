import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardItemEditComponent } from './dashboard-item-edit.component';

describe('DashboardBlockComponent', () => {
  let component: DashboardItemEditComponent;
  let fixture: ComponentFixture<DashboardItemEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardItemEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
