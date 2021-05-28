import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EformExcelReportHeaderComponent } from './eform-excel-report-header.component';

describe('EformExcelReportHeaderComponent', () => {
  let component: EformExcelReportHeaderComponent;
  let fixture: ComponentFixture<EformExcelReportHeaderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EformExcelReportHeaderComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EformExcelReportHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
