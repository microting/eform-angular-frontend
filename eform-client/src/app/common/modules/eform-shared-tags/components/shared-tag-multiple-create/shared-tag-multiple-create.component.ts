import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import {SharedTagMultipleCreateModel} from 'src/app/common/models';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-shared-tag-multiple-create',
    templateUrl: './shared-tag-multiple-create.component.html',
    styleUrls: ['./shared-tag-multiple-create.component.scss'],
    standalone: false
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
