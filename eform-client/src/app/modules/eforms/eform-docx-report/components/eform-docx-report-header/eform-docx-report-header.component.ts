import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import {EformDocxReportGenerateModel} from 'src/app/common/models';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {format} from 'date-fns';
import {MatIconRegistry} from '@angular/material/icon';
import {WordIcon} from 'src/app/common/const';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'app-eform-docx-report-header',
    templateUrl: './eform-docx-report-header.component.html',
    styleUrls: ['./eform-docx-report-header.component.scss'],
    standalone: false
})
export class EformDocxReportHeaderComponent implements OnInit {
  @Output()
  generateReport: EventEmitter<EformDocxReportGenerateModel> = new EventEmitter();
  @Output()
  downloadReport: EventEmitter<EformDocxReportGenerateModel> = new EventEmitter();
  @Input() range: Date[];
  @Input() templateId: number;
  generateForm: FormGroup;

  constructor() {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);

    iconRegistry.addSvgIconLiteral('file-word', sanitizer.bypassSecurityTrustHtml(WordIcon));
  }

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
