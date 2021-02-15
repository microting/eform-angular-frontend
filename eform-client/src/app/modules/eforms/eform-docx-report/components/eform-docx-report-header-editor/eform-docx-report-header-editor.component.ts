import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { EformDocxReportHeadersModel } from 'src/app/common/models';

@Component({
  selector: 'app-eform-docx-report-header-editor',
  templateUrl: './eform-docx-report-header-editor.component.html',
  styleUrls: ['./eform-docx-report-header-editor.component.scss'],
})
export class EformDocxReportHeaderEditorComponent implements OnInit {
  @Input()
  reportHeadersModel: EformDocxReportHeadersModel = new EformDocxReportHeadersModel();
  @Output()
  updateReportHeaders: EventEmitter<EformDocxReportHeadersModel> = new EventEmitter<EformDocxReportHeadersModel>();
  headers = [{}, {}, {}, {}, {}];

  constructor() {}

  ngOnInit(): void {}

  updateHeaders() {
    this.updateReportHeaders.emit(this.reportHeadersModel);
  }
}
