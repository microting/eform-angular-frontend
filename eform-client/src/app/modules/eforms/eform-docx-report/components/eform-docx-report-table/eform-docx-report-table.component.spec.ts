import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EformDocxReportTableComponent } from './eform-docx-report-table.component';

describe('EformDocxReportTableComponent', () => {
  let component: EformDocxReportTableComponent;
  let fixture: ComponentFixture<EformDocxReportTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EformDocxReportTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EformDocxReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
