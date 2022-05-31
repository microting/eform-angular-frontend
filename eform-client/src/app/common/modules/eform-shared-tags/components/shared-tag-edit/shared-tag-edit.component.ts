import {
  Component,
  Inject,
  OnDestroy,
} from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import {SharedTagModel} from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@AutoUnsubscribe()
@Component({
  selector: 'app-shared-tag-edit',
  templateUrl: './shared-tag-edit.component.html',
  styleUrls: ['./shared-tag-edit.component.scss'],
})
export class SharedTagEditComponent implements OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<SharedTagEditComponent>,
    @Inject(MAT_DIALOG_DATA) public tagModel: SharedTagModel = new SharedTagModel()) {}

  updateItem() {
    this.dialogRef.close(this.tagModel);
  }

  cancelEdit() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {}
}
