import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EformExcelReportModalComponent } from './eform-excel-report-modal.component';

describe('EformExcelReportModalComponent', () => {
  let component: EformExcelReportModalComponent;
  let fixture: ComponentFixture<EformExcelReportModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EformExcelReportModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EformExcelReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
