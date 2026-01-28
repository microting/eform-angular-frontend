import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import {
  CommonDictionaryModel,
  SharedTagModel,
} from 'src/app/common/models';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgIf, NgFor } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-shared-tags',
    templateUrl: './shared-tags.component.html',
    styleUrls: ['./shared-tags.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, NgIf, MatIcon, NgFor, MatIconButton, MatTooltip, MatDialogActions, TranslatePipe]
})
export class SharedTagsComponent implements OnInit {
  dialogRef = inject<MatDialogRef<SharedTagsComponent>>(MatDialogRef);

  public availableTags: SharedTagModel[] = [];
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
