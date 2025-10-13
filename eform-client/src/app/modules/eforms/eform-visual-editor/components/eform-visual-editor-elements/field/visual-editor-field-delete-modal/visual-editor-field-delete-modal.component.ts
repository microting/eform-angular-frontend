import { Component, OnInit, inject } from '@angular/core';
import { EformVisualEditorRecursionFieldModel } from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-visual-editor-field-delete-modal',
    templateUrl: './visual-editor-field-delete-modal.component.html',
    styleUrls: ['./visual-editor-field-delete-modal.component.scss'],
    standalone: false
})
export class VisualEditorFieldDeleteModalComponent implements OnInit {
  dialogRef = inject<MatDialogRef<VisualEditorFieldDeleteModalComponent>>(MatDialogRef);
  private recursionFieldModel = inject<EformVisualEditorRecursionFieldModel>(MAT_DIALOG_DATA);


  ngOnInit() {}

  hide(result = false) {
    this.dialogRef.close(result);
  }
}
