import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import {
  CommonDictionaryModel,
  SharedTagModel,
} from 'src/app/common/models';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'app-shared-tags',
    templateUrl: './shared-tags.component.html',
    styleUrls: ['./shared-tags.component.scss'],
    standalone: false
})
export class SharedTagsComponent implements OnInit {
  dialogRef = inject<MatDialogRef<SharedTagsComponent>>(MatDialogRef);

  public availableTags: CommonDictionaryModel[] = [];
  public showMultipleCreateBtn: boolean = false;
  public showCreateTag: EventEmitter<void> = new EventEmitter<void>();
  public showEditTag: EventEmitter<SharedTagModel> = new EventEmitter<SharedTagModel>();
  public showDeleteTag: EventEmitter<SharedTagModel> = new EventEmitter<SharedTagModel>();
  public showMultipleCreateTag: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
    const availableTags = inject(MAT_DIALOG_DATA) ?? [];

    this.availableTags = availableTags;
  }

  hide() {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  showCreateTagModal() {
    this.showCreateTag.emit();
  }

  showEditTagModal(tag: SharedTagModel) {
    this.showEditTag.emit(tag);
  }

  showDeleteTagModal(tag: SharedTagModel) {
    this.showDeleteTag.emit(tag);
  }

  showMultipleCreateTagModal() {
    this.showMultipleCreateTag.emit();
  }
}
