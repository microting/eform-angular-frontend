import { Component, OnInit, inject } from '@angular/core';
import {EformVisualEditorRecursionChecklistModel,} from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-visual-editor-checklist-delete-modal',
    templateUrl: './visual-editor-checklist-delete-modal.component.html',
    styleUrls: ['./visual-editor-checklist-delete-modal.component.scss'],
    standalone: false
})
export class VisualEditorChecklistDeleteModalComponent implements OnInit {
  dialogRef = inject<MatDialogRef<VisualEditorChecklistDeleteModalComponent>>(MatDialogRef);
  private recursionChecklistModel = inject<EformVisualEditorRecursionChecklistModel>(MAT_DIALOG_DATA) ?? new EformVisualEditorRecursionChecklistModel();


  ngOnInit() {}

  hide(result = false) {
    this.dialogRef.close(result);
  }
}
