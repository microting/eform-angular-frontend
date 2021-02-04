import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EformDocxReportHeaderComponent } from './eform-docx-report-header.component';

describe('EformDocxReportHeaderComponent', () => {
  let component: EformDocxReportHeaderComponent;
  let fixture: ComponentFixture<EformDocxReportHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EformDocxReportHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EformDocxReportHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
