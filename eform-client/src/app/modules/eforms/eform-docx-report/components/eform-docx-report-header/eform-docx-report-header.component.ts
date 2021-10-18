import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EformDocxReportGenerateModel } from 'src/app/common/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { DateTimeAdapter } from '@danielmoncada/angular-datetime-picker';
import { LocaleService } from 'src/app/common/services';
import { format } from 'date-fns';
import { AuthStateService } from 'src/app/common/store';

@Component({
  selector: 'app-eform-docx-report-header',
  templateUrl: './eform-docx-report-header.component.html',
  styleUrls: ['./eform-docx-report-header.component.scss'],
})
export class EformDocxReportHeaderComponent implements OnInit {
  @Output()
  generateReport: EventEmitter<EformDocxReportGenerateModel> = new EventEmitter();
  @Output()
  downloadReport: EventEmitter<EformDocxReportGenerateModel> = new EventEmitter();
  @Input() range: Date[];
  @Input() templateId: number;
  generateForm: FormGroup;

  constructor(
    // dateTimeAdapter: DateTimeAdapter<any>,
    private localeService: LocaleService,
    private formBuilder: FormBuilder,
    authStateService: AuthStateService
  ) {
    // dateTimeAdapter.setLocale(authStateService.currentUserLocale);
  }

  ngOnInit() {
    this.generateForm = this.formBuilder.group({
      dateRange: ['', Validators.required],
    });
  }

  onSubmit() {
    const model = this.extractData(this.generateForm.value);
    this.generateReport.emit(model);
  }

  onSave() {
    const model = this.extractData(this.generateForm.value);
    this.downloadReport.emit(model);
  }

  private extractData(formValue: any): EformDocxReportGenerateModel {
    return new EformDocxReportGenerateModel({
      dateFrom: format(formValue.dateRange[0], 'yyyy-MM-dd'),
      dateTo: format(formValue.dateRange[1], 'yyyy-MM-dd'),
      templateId: this.templateId,
    });
  }
}
