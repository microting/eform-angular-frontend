import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import {EformDocxReportHeadersModel} from 'src/app/common/models';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-eform-docx-report-header-editor',
    templateUrl: './eform-docx-report-header-editor.component.html',
    styleUrls: ['./eform-docx-report-header-editor.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatFormField, MatLabel, MatInput, ReactiveFormsModule, FormsModule, MatDialogActions, MatButton, TranslatePipe]
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
