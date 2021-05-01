import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningsBulkImportModalComponent } from './plannings-bulk-import-modal.component';

describe('PlanningsBulkImportModalComponent', () => {
  let component: PlanningsBulkImportModalComponent;
  let fixture: ComponentFixture<PlanningsBulkImportModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningsBulkImportModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningsBulkImportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
