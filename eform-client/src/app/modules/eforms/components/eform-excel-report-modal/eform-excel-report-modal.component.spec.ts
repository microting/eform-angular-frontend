import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EformExcelReportModalComponent } from './eform-excel-report-modal.component';

describe('EformExcelReportModalComponent', () => {
  let component: EformExcelReportModalComponent;
  let fixture: ComponentFixture<EformExcelReportModalComponent>;

  beforeEach(waitForAsync(() => {
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
