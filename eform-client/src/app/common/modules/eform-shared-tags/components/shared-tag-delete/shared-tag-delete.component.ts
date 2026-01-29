import { Component, EventEmitter, inject } from '@angular/core';
import { SharedTagModel } from 'src/app/common/models';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-shared-tag-delete',
    templateUrl: './shared-tag-delete.component.html',
    styleUrls: ['./shared-tag-delete.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, TranslatePipe]
})
export class SharedTagDeleteComponent {
  dialogRef = inject<MatDialogRef<SharedTagDeleteComponent>>(MatDialogRef);
  tagModel = inject<SharedTagModel>(MAT_DIALOG_DATA) ?? new SharedTagModel();

  public deletedTag: EventEmitter<SharedTagModel> = new EventEmitter<SharedTagModel>();

  deleteTag() {
    this.deletedTag.emit(this.tagModel);
  }

  cancelDelete() {
    this.dialogRef.close();
  }
}
