import { Component, OnInit, inject } from '@angular/core';
import { EformVisualEditorRecursionFieldModel } from 'src/app/common/models';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogActions } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-visual-editor-field-delete-modal',
    templateUrl: './visual-editor-field-delete-modal.component.html',
    styleUrls: ['./visual-editor-field-delete-modal.component.scss'],
    imports: [MatDialogTitle, MatDialogActions, MatButton, TranslatePipe]
})
export class VisualEditorFieldDeleteModalComponent implements OnInit {
  dialogRef = inject<MatDialogRef<VisualEditorFieldDeleteModalComponent>>(MatDialogRef);
  private recursionFieldModel = inject<EformVisualEditorRecursionFieldModel>(MAT_DIALOG_DATA);


  ngOnInit() {}

  hide(result = false) {
    this.dialogRef.close(result);
  }
}
