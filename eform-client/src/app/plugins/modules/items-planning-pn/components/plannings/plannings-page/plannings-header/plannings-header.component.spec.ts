import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningsHeaderComponent } from './plannings-header.component';

describe('PlanningsHeaderComponent', () => {
  let component: PlanningsHeaderComponent;
  let fixture: ComponentFixture<PlanningsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningsHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
