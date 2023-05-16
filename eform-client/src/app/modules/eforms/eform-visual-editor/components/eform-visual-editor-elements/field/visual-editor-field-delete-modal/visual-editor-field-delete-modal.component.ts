import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { EformVisualEditorRecursionFieldModel } from 'src/app/common/models';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-visual-editor-field-delete-modal',
  templateUrl: './visual-editor-field-delete-modal.component.html',
  styleUrls: ['./visual-editor-field-delete-modal.component.scss'],
})
export class VisualEditorFieldDeleteModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<VisualEditorFieldDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) private recursionFieldModel: EformVisualEditorRecursionFieldModel) {}

  ngOnInit() {}

  hide(result = false) {
    this.dialogRef.close(result);
  }
}
