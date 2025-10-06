import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import {EformDocxReportHeadersModel} from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-eform-docx-report-header-editor',
    templateUrl: './eform-docx-report-header-editor.component.html',
    styleUrls: ['./eform-docx-report-header-editor.component.scss'],
    standalone: false
})
export class EformDocxReportHeaderEditorComponent implements OnInit {
  dialogRef = inject<MatDialogRef<EformDocxReportHeaderEditorComponent>>(MatDialogRef);
  reportHeadersModel = inject<EformDocxReportHeadersModel>(MAT_DIALOG_DATA) ?? new EformDocxReportHeadersModel();

  @Output()
  updateReportHeaders: EventEmitter<EformDocxReportHeadersModel> = new EventEmitter<EformDocxReportHeadersModel>();

  ngOnInit(): void {}


  hide() {
    this.dialogRef.close();
  }

  updateHeaders() {
    this.updateReportHeaders.emit(this.reportHeadersModel);
  }
}
