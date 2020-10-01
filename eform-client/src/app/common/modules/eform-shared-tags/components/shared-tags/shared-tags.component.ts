import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
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

@Component({
  selector: 'app-shared-tags',
  templateUrl: './shared-tags.component.html',
  styleUrls: ['./shared-tags.component.scss']
})
export class SharedTagsComponent implements OnInit {
  @ViewChild('frame') frame;
  @ViewChild('tagCreateModal') tagCreateModal: SharedTagCreateComponent;
  @ViewChild('tagEditModal') tagEditModal: SharedTagEditComponent;
  @ViewChild('tagDeleteModal') tagDeleteModal: SharedTagDeleteComponent;
  @Input() availableTags: CommonDictionaryModel[] = [];
  @Output() createTag: EventEmitter<SharedTagCreateModel> = new EventEmitter<
    SharedTagCreateModel
  >();
  @Output() updateTag: EventEmitter<SharedTagModel> = new EventEmitter<
    SharedTagModel
  >();
  @Output() deleteTag: EventEmitter<SharedTagModel> = new EventEmitter<
    SharedTagModel
  >();

  constructor() {}

  show() {
    this.frame.show();
  }

  hide() {
    this.frame.hide();
  }

  ngOnInit() {}

  showCreateTagModal() {
    this.frame.hide();
    this.tagCreateModal.show();
  }

  showEditTagModal(tag: SharedTagModel) {
    this.frame.hide();
    this.tagEditModal.show(tag);
  }

  showDeleteTagModal(tag: SharedTagModel) {
    this.frame.hide();
    this.tagDeleteModal.show(tag);
  }

  onChildrenModalHide() {
    this.frame.show();
  }

  onTagUpdate(model: SharedTagModel) {
    this.updateTag.emit(model);
  }

  onTagCreate(model: SharedTagCreateModel) {
    this.createTag.emit(model);
  }

  onTagDelete(model: SharedTagModel) {
    this.deleteTag.emit(model);
  }
}
