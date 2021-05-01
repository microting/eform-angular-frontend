import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocaleService } from 'src/app/common/services/auth';
import { format } from 'date-fns';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportPnGenerateModel } from '../../../models/report';
import { DateTimeAdapter } from 'ng-pick-datetime-ex';
import { SharedTagModel } from 'src/app/common/models';

@Component({
  selector: 'app-items-planning-pn-report-header',
  templateUrl: './report-header.component.html',
  styleUrls: ['./report-header.component.scss'],
})
export class ReportHeaderComponent implements OnInit {
  @Output() generateReport: EventEmitter<
    ReportPnGenerateModel
  > = new EventEmitter();
  @Output() downloadReport: EventEmitter<
    ReportPnGenerateModel
  > = new EventEmitter();
  @Input() range: Date[];
  @Input() availableTags: SharedTagModel[] = [];
  generateForm: FormGroup;

  constructor(
    dateTimeAdapter: DateTimeAdapter<any>,
    private localeService: LocaleService,
    private formBuilder: FormBuilder
  ) {
    dateTimeAdapter.setLocale(this.localeService.getCurrentUserLocale());
  }

  ngOnInit() {
    this.generateForm = this.formBuilder.group({
      dateRange: ['', Validators.required],
      tagIds: [[]],
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

  private extractData(formValue: any): ReportPnGenerateModel {
    return new ReportPnGenerateModel({
      dateFrom: format(formValue.dateRange[0], 'yyyy-MM-dd'),
      dateTo: format(formValue.dateRange[1], 'yyyy-MM-dd'),
      tagIds: [...formValue.tagIds],
    });
  }
}
