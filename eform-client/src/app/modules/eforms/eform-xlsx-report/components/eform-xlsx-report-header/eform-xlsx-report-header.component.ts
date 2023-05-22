import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EformDocxReportGenerateModel } from 'src/app/common/models';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DateTimeAdapter } from '@danielmoncada/angular-datetime-picker';
import { LocaleService } from 'src/app/common/services';
import { format } from 'date-fns';
import { AuthStateService } from 'src/app/common/store';

@Component({
  selector: 'app-eform-xlsx-report-header',
  templateUrl: './eform-xlsx-report-header.component.html',
  styleUrls: ['./eform-xlsx-report-header.component.scss'],
})
export class EformXlsxReportHeaderComponent implements OnInit {
  @Output()
  downloadReport: EventEmitter<EformDocxReportGenerateModel> = new EventEmitter();
  @Input() range: Date[];
  @Input() templateId: number;
  generateForm: UntypedFormGroup;

  constructor(
    dateTimeAdapter: DateTimeAdapter<any>,
    private localeService: LocaleService,
    private formBuilder: UntypedFormBuilder,
    authStateService: AuthStateService
  ) {
    dateTimeAdapter.setLocale(authStateService.currentUserLocale);
  }

  ngOnInit() {
    this.generateForm = this.formBuilder.group({
      dateRange: ['', Validators.required],
    });
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
