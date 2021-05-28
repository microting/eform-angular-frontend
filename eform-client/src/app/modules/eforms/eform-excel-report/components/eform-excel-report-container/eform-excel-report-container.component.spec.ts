import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EformExcelReportContainerComponent } from './eform-excel-report-container.component';

describe('EformExcelReportContainerComponent', () => {
  let component: EformExcelReportContainerComponent;
  let fixture: ComponentFixture<EformExcelReportContainerComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EformExcelReportContainerComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EformExcelReportContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
