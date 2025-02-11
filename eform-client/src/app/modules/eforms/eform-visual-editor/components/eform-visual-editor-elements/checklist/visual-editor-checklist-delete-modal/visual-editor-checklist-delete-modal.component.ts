import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {EformVisualEditorRecursionChecklistModel,} from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-visual-editor-checklist-delete-modal',
    templateUrl: './visual-editor-checklist-delete-modal.component.html',
    styleUrls: ['./visual-editor-checklist-delete-modal.component.scss'],
    standalone: false
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
