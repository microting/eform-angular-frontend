import { Component, EventEmitter, OnDestroy, inject } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import {SharedTagModel} from 'src/app/common/models';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@AutoUnsubscribe()
@Component({
    selector: 'app-shared-tag-edit',
    templateUrl: './shared-tag-edit.component.html',
    styleUrls: ['./shared-tag-edit.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatFormField, MatInput, ReactiveFormsModule, FormsModule, MatLabel, MatDialogActions, MatButton, TranslatePipe]
})
export class SharedTagEditComponent implements OnDestroy {
  dialogRef = inject<MatDialogRef<SharedTagEditComponent>>(MatDialogRef);

  public updatedTag: EventEmitter<SharedTagModel> = new EventEmitter<SharedTagModel>();
  public tagModel: SharedTagModel = new SharedTagModel()

  constructor() {
    const tagModel = inject<SharedTagModel>(MAT_DIALOG_DATA) ?? new SharedTagModel();

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
