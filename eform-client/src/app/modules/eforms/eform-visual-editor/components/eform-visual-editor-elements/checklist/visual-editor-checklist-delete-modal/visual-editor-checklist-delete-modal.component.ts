import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {EformVisualEditorRecursionChecklistModel,} from 'src/app/common/models';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-visual-editor-checklist-delete-modal',
  templateUrl: './visual-editor-checklist-delete-modal.component.html',
  styleUrls: ['./visual-editor-checklist-delete-modal.component.scss'],
})
export class VisualEditorChecklistDeleteModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<VisualEditorChecklistDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) private recursionChecklistModel: EformVisualEditorRecursionChecklistModel =
      new EformVisualEditorRecursionChecklistModel()
  ) {}

  ngOnInit() {}

  hide(result = false) {
    this.dialogRef.close(result);
  }
}
