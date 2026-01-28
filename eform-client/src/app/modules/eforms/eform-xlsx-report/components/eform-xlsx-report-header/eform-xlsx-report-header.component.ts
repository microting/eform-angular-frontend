import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EformDocxReportGenerateModel} from 'src/app/common/models';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {format} from 'date-fns';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatDatepickerToggle, MatDateRangeInput, MatStartDate, MatEndDate, MatDateRangePicker } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-eform-xlsx-report-header',
    templateUrl: './eform-xlsx-report-header.component.html',
    styleUrls: ['./eform-xlsx-report-header.component.scss'],
    imports: [ReactiveFormsModule, MatFormField, MatLabel, MatDatepickerToggle, MatPrefix, MatDateRangeInput, MatStartDate, MatEndDate, MatDateRangePicker, MatButton, TranslatePipe]
})
export class EformXlsxReportHeaderComponent implements OnInit {
  @Output()
  downloadReport: EventEmitter<EformDocxReportGenerateModel> = new EventEmitter();
  @Input() range: Date[];
  @Input() templateId: number;
  generateForm: FormGroup;

  constructor() {
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
