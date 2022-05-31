import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  CommonDictionaryModel,
  SharedTagModel,
} from 'src/app/common/models';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

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

  ngOnInit() {
  }

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
