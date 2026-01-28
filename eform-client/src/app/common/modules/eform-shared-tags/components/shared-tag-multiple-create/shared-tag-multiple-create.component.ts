import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import {SharedTagMultipleCreateModel} from 'src/app/common/models';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-shared-tag-multiple-create',
    templateUrl: './shared-tag-multiple-create.component.html',
    styleUrls: ['./shared-tag-multiple-create.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatFormField, MatInput, ReactiveFormsModule, FormsModule, MatLabel, MatDialogActions, MatButton, TranslatePipe]
})
export class SharedTagMultipleCreateComponent implements OnInit {
  dialogRef = inject<MatDialogRef<SharedTagMultipleCreateComponent>>(MatDialogRef);

  public createdTags: EventEmitter<SharedTagMultipleCreateModel> = new EventEmitter<SharedTagMultipleCreateModel>();
  textareaValue: string = '';

  ngOnInit() {}

  createTags() {
    this.createdTags.emit({ tagNames: this.textareaValue.split('\n') });
  }

  cancelCreate() {
    this.dialogRef.close();
  }
}
