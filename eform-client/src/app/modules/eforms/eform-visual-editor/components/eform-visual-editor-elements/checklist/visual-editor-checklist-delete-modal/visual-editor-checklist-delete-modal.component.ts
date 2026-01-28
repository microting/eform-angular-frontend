import { Component, OnInit, inject } from '@angular/core';
import {EformVisualEditorRecursionChecklistModel,} from 'src/app/common/models';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogActions } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-visual-editor-checklist-delete-modal',
    templateUrl: './visual-editor-checklist-delete-modal.component.html',
    styleUrls: ['./visual-editor-checklist-delete-modal.component.scss'],
    imports: [MatDialogTitle, MatDialogActions, MatButton, TranslatePipe]
})
export class VisualEditorChecklistDeleteModalComponent implements OnInit {
  dialogRef = inject<MatDialogRef<VisualEditorChecklistDeleteModalComponent>>(MatDialogRef);
  private recursionChecklistModel = inject<EformVisualEditorRecursionChecklistModel>(MAT_DIALOG_DATA) ?? new EformVisualEditorRecursionChecklistModel();


  ngOnInit() {}

  hide(result = false) {
    this.dialogRef.close(result);
  }
}
