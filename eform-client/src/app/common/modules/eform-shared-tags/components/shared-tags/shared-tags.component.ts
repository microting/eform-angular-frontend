import {
  Component,
  EventEmitter,
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
  public showCreateTag: EventEmitter<void> = new EventEmitter<void>();
  public showEditTag: EventEmitter<SharedTagModel> = new EventEmitter<SharedTagModel>();
  public showDeleteTag: EventEmitter<SharedTagModel> = new EventEmitter<SharedTagModel>();

  constructor(
    public dialogRef: MatDialogRef<SharedTagsComponent>,
    @Inject(MAT_DIALOG_DATA) availableTags: CommonDictionaryModel[] = [],) {
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
}
