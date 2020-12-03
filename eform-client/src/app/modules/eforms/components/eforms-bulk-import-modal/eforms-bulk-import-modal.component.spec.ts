import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EformsBulkImportModalComponent } from './eforms-bulk-import-modal.component';

describe('EformsBulkImportModalComponent', () => {
  let component: EformsBulkImportModalComponent;
  let fixture: ComponentFixture<EformsBulkImportModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EformsBulkImportModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EformsBulkImportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
