import { ComponentFixture, TestBed, waitForAsync  } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockTranslatePipe } from 'src/test-helpers';
import { EformDocxReportHeaderComponent } from './eform-docx-report-header.component';

describe('EformDocxReportHeaderComponent', () => {
  let component: EformDocxReportHeaderComponent;
  let fixture: ComponentFixture<EformDocxReportHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [FormsModule, EformDocxReportHeaderComponent],
    declarations: [MockTranslatePipe],
    schemas: [NO_ERRORS_SCHEMA]
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
