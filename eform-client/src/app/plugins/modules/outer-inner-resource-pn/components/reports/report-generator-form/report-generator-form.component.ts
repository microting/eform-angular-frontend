import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {LocaleService} from 'src/app/common/services/auth';

import {ReportPnGenerateModel} from '../../../models';
import {format} from 'date-fns';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OuterInnerResourcePnReportsService} from '../../../services';
import {ReportNamesModel} from '../../../models/report/report-names.model';
import {OuterInnerResourcePnReportTypeEnum} from '../../../enums';
import {DateTimeAdapter} from 'ng-pick-datetime-ex';

@Component({
  selector: 'app-machine-area-pn-report-generator-form',
  templateUrl: './report-generator-form.component.html',
  styleUrls: ['./report-generator-form.component.scss']
})
export class ReportGeneratorFormComponent implements OnInit {
  @Output() generateReport: EventEmitter<ReportPnGenerateModel> = new EventEmitter();
  @Output() saveReport: EventEmitter<ReportPnGenerateModel> = new EventEmitter();
  generateForm: FormGroup;
  reportNames: ReportNamesModel = new ReportNamesModel();

  get reportType() { return OuterInnerResourcePnReportTypeEnum; }
  // get relationshipTypes() { return OuterInnerResourcePnReportRelationshipEnum; }

  constructor(dateTimeAdapter: DateTimeAdapter<any>,
              private localeService: LocaleService,
              private reportService: OuterInnerResourcePnReportsService,
              private formBuilder: FormBuilder) {
    dateTimeAdapter.setLocale(this.localeService.getCurrentUserLocale());
  }

  ngOnInit() {
    this.generateForm = this.formBuilder.group({
      dateRange: ['', Validators.required],
      type: [null, Validators.required],
      relationship: [null, Validators.required]
    });
    this.getReportNames();
  }

  onSubmit() {
    const model = this.extractData(this.generateForm.value);
    this.generateReport.emit(model);
  }

  onSave() {
    const model = this.extractData(this.generateForm.value);
    this.saveReport.emit(model);
  }

  getReportNames() {
    // this.getReportNames();
    // debugger;
    this.reportService.getReportNames().subscribe( (data) => {
      if (data && data.success) {
        // debugger;
        this.reportNames = data.model;
      }
    });
    // return OuterInnerResourcePnReportRelationshipEnum;
  }

  private extractData(formValue: any): ReportPnGenerateModel {
    return new ReportPnGenerateModel(
      {
        type: formValue.type,
        relationship: formValue.relationship,
        dateFrom: format(formValue.dateRange[0], 'YYYY-MM-DD'),
        dateTo: format(formValue.dateRange[1], 'YYYY-MM-DD')
      }
    );
  }
}
