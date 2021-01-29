import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EformDocxReportContainerComponent } from './eform-docx-report-container.component';

describe('EformDocxReportContainerComponent', () => {
  let component: EformDocxReportContainerComponent;
  let fixture: ComponentFixture<EformDocxReportContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EformDocxReportContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EformDocxReportContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
