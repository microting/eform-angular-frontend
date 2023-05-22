import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
} from '@angular/core';
import {EformDocxReportHeadersModel} from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-eform-docx-report-header-editor',
  templateUrl: './eform-docx-report-header-editor.component.html',
  styleUrls: ['./eform-docx-report-header-editor.component.scss'],
})
export class EformDocxReportHeaderEditorComponent implements OnInit {
  @Output()
  updateReportHeaders: EventEmitter<EformDocxReportHeadersModel> = new EventEmitter<EformDocxReportHeadersModel>();

  constructor(
    public dialogRef: MatDialogRef<EformDocxReportHeaderEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public reportHeadersModel: EformDocxReportHeadersModel = new EformDocxReportHeadersModel()) {}

  ngOnInit(): void {}


  hide() {
    this.dialogRef.close();
  }

  updateHeaders() {
    this.updateReportHeaders.emit(this.reportHeadersModel);
  }
}
