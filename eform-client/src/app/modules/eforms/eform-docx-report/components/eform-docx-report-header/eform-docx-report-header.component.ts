import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {EformDocxReportGenerateModel} from 'src/app/common/models';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {format} from 'date-fns';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatDatepickerToggle, MatDateRangeInput, MatStartDate, MatEndDate, MatDateRangePicker } from '@angular/material/datepicker';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-eform-docx-report-header',
    templateUrl: './eform-docx-report-header.component.html',
    styleUrls: ['./eform-docx-report-header.component.scss'],
    imports: [ReactiveFormsModule, MatFormField, MatLabel, MatDatepickerToggle, MatPrefix, MatDateRangeInput, MatStartDate, MatEndDate, MatDateRangePicker, MatButton, MatIconButton, MatIcon, TranslatePipe]
})
export class EformDocxReportHeaderComponent implements OnInit {
  @Output()
  generateReport: EventEmitter<EformDocxReportGenerateModel> = new EventEmitter();
  @Output()
  downloadReport: EventEmitter<EformDocxReportGenerateModel> = new EventEmitter();
  @Input() range: Date[];
  @Input() templateId: number;
  generateForm: FormGroup;

  ngOnInit() {
    this.generateForm = new FormGroup({
      startDate: new FormControl<Date | null>(null, Validators.required),
      endDate: new FormControl<Date | null>(null, Validators.required),
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

  private extractData(formValue: { startDate: Date, endDate: Date }): EformDocxReportGenerateModel {
    return new EformDocxReportGenerateModel({
      dateFrom: format(formValue.startDate, 'yyyy-MM-dd'),
      dateTo: format(formValue.endDate, 'yyyy-MM-dd'),
      templateId: this.templateId,
    });
  }
}
