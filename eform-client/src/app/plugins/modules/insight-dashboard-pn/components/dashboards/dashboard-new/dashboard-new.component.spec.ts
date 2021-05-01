import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardNewComponent } from './dashboard-new.component';

describe('DashboardNewComponent', () => {
  let component: DashboardNewComponent;
  let fixture: ComponentFixture<DashboardNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
