import {
  Component,
  EventEmitter,
  Inject,
} from '@angular/core';
import { SharedTagModel } from 'src/app/common/models';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-shared-tag-delete',
  templateUrl: './shared-tag-delete.component.html',
  styleUrls: ['./shared-tag-delete.component.scss']
})
export class SharedTagDeleteComponent {
  public deletedTag: EventEmitter<SharedTagModel> = new EventEmitter<SharedTagModel>();
  constructor(
    public dialogRef: MatDialogRef<SharedTagDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public tagModel: SharedTagModel = new SharedTagModel()) {}

  deleteTag() {
    this.deletedTag.emit(this.tagModel);
  }

  cancelDelete() {
    this.dialogRef.close();
  }
}
