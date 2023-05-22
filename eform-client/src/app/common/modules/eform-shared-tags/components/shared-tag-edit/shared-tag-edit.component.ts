import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
} from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import {SharedTagModel} from 'src/app/common/models';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';

@AutoUnsubscribe()
@Component({
  selector: 'app-shared-tag-edit',
  templateUrl: './shared-tag-edit.component.html',
  styleUrls: ['./shared-tag-edit.component.scss'],
})
export class SharedTagEditComponent implements OnDestroy {
  public updatedTag: EventEmitter<SharedTagModel> = new EventEmitter<SharedTagModel>();
  public tagModel: SharedTagModel = new SharedTagModel()

  constructor(
    public dialogRef: MatDialogRef<SharedTagEditComponent>,
    @Inject(MAT_DIALOG_DATA) tagModel: SharedTagModel = new SharedTagModel()) {
    this.tagModel = {...tagModel};
  }

  updateItem() {
    this.updatedTag.emit(this.tagModel);
  }

  cancelEdit() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {}
}
