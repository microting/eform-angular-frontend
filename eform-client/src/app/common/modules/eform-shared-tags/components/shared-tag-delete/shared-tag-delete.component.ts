import {
  Component,
  EventEmitter,
  Inject,
} from '@angular/core';
import { SharedTagModel } from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-shared-tag-delete',
    templateUrl: './shared-tag-delete.component.html',
    styleUrls: ['./shared-tag-delete.component.scss'],
    standalone: false
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
