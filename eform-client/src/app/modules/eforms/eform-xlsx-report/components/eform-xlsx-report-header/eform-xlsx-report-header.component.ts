import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EformDocxReportGenerateModel} from 'src/app/common/models';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DateTimeAdapter} from '@danielmoncada/angular-datetime-picker';
import {LocaleService} from 'src/app/common/services';
import {format} from 'date-fns';
import {AuthStateService} from 'src/app/common/store';

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
  generateForm: FormGroup;

  constructor(
    dateTimeAdapter: DateTimeAdapter<any>,
    private localeService: LocaleService,
    authStateService: AuthStateService
  ) {
    dateTimeAdapter.setLocale(authStateService.currentUserLocale);
  }

  ngOnInit() {
    this.generateForm = new FormGroup({
      startDate: new FormControl<Date | null>(null, Validators.required),
      endDate: new FormControl<Date | null>(null, Validators.required),
    });
  }

  onSave() {
    const model = this.extractData(this.generateForm.value);
    this.downloadReport.emit(model);
  }

  private extractData(formValue: { startDate: Date, endDate: Date }): EformDocxReportGenerateModel {
    return new EformDocxReportGenerateModel({
      dateFrom: format(formValue.startDate, 'yyyy-MM-dd'),
      dateTo: format(formValue.endDate, 'yyyy-MM-dd'),
      templateId: this.templateId,
    });
  }
}
