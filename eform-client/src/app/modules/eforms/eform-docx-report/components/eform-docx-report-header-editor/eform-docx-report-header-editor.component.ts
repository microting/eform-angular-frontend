import {Component, Input, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import { EformDocxReportHeadersModel } from 'src/app/common/models';

@Component({
  selector: 'app-eform-docx-report-header-editor',
  templateUrl: './eform-docx-report-header-editor.component.html',
  styleUrls: ['./eform-docx-report-header-editor.component.scss'],
})
export class EformDocxReportHeaderEditorComponent implements OnInit {
  @ViewChild('frame', {static: true}) frame;
  @Output()
  updateReportHeaders: EventEmitter<EformDocxReportHeadersModel> = new EventEmitter<EformDocxReportHeadersModel>();
  reportHeadersModel: EformDocxReportHeadersModel = new EformDocxReportHeadersModel();
  headers = [{}, {}, {}, {}, {}];

  constructor() {}

  ngOnInit(): void {}

  hide() {
    this.frame.hide();
    this.reportHeadersModel = new EformDocxReportHeadersModel();
  }

  show(model: EformDocxReportHeadersModel) {
    this.reportHeadersModel = model;
    this.frame.show();
  }

  updateHeaders() {
    this.updateReportHeaders.emit(this.reportHeadersModel);
  }
}
