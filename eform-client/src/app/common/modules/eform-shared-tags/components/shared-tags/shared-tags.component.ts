import {
  Component,
  EventEmitter, Inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  CommonDictionaryModel,
  SharedTagCreateModel,
  SharedTagModel,
} from 'src/app/common/models';
import { SharedTagDeleteComponent } from '../shared-tag-delete/shared-tag-delete.component';
import { SharedTagCreateComponent } from '../shared-tag-create/shared-tag-create.component';
import { SharedTagEditComponent } from '../shared-tag-edit/shared-tag-edit.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-shared-tags',
  templateUrl: './shared-tags.component.html',
  styleUrls: ['./shared-tags.component.scss']
})
export class SharedTagsComponent implements OnInit {
  public availableTags: CommonDictionaryModel[] = [];

  constructor(
    public dialogRef: MatDialogRef<SharedTagsComponent>,
    @Inject(MAT_DIALOG_DATA) availableTags: CommonDictionaryModel[] = [],) {
    this.availableTags = availableTags;
  }

  hide(action: string, tag?: SharedTagModel) {
    this.dialogRef.close({action, tag});
  }

  ngOnInit() {}

  showCreateTagModal() {
    this.hide('create');
  }

  showEditTagModal(tag: SharedTagModel) {
    this.hide('edit', tag);
  }

  showDeleteTagModal(tag: SharedTagModel) {
    this.hide('delete', tag);
  }
}
