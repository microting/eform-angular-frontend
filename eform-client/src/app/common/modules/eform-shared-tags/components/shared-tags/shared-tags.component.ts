import {Component, EventEmitter, OnInit, inject} from '@angular/core';
import {NgIf} from '@angular/common';
import {
  CommonDictionaryModel,
  SharedTagModel,
} from 'src/app/common/models';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions} from '@angular/material/dialog';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {MtxGrid, MtxGridColumn} from '@ng-matero/extensions/grid';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-shared-tags',
  templateUrl: './shared-tags.component.html',
  styleUrls: ['./shared-tags.component.scss'],
  imports: [
    NgIf,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatIconButton,
    MatIcon,
    MatTooltip,
    MtxGrid,
    TranslatePipe,
  ],
})
export class SharedTagsComponent implements OnInit {
  dialogRef = inject<MatDialogRef<SharedTagsComponent>>(MatDialogRef);

  public availableTags: SharedTagModel[] = [];
  public showMultipleCreateBtn: boolean = false;
  public showCreateTag: EventEmitter<void> = new EventEmitter<void>();
  public showEditTag: EventEmitter<SharedTagModel> = new EventEmitter<SharedTagModel>();
  public showDeleteTag: EventEmitter<SharedTagModel> = new EventEmitter<SharedTagModel>();
  public showMultipleCreateTag: EventEmitter<void> = new EventEmitter<void>();
  public tableHeaders: MtxGridColumn[] = [
    {
      header: 'Label',
      field: 'name',
      sortable: false,
      width: '250px',
    },
    {
      header: '',
      field: 'actions',
      width: '80px',
    },
  ];


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
