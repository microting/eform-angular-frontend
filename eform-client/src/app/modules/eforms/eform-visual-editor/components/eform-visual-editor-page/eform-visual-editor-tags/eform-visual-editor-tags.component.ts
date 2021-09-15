import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SharedTagsComponent } from 'src/app/common/modules/eform-shared-tags/components';
import {
  CommonDictionaryModel,
  SharedTagCreateModel,
  SharedTagModel,
} from 'src/app/common/models';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { EformTagService } from 'src/app/common/services';

@AutoUnsubscribe()
@Component({
  selector: 'app-eform-visual-editor-tags',
  templateUrl: './eform-visual-editor-tags.component.html',
  styleUrls: ['./eform-visual-editor-tags.component.scss'],
})
export class EformVisualEditorTagsComponent implements OnInit, OnDestroy {
  @ViewChild('tagsModal') tagsModal: SharedTagsComponent;
  @Input() availableTags: CommonDictionaryModel[] = [];
  @Output() tagsChanged: EventEmitter<void> = new EventEmitter<void>();
  deleteTag$: Subscription;
  createTag$: Subscription;
  updateTag$: Subscription;

  constructor(private eFormTagService: EformTagService) {}

  show() {
    this.tagsModal.show();
  }

  hide() {
    this.tagsModal.hide();
  }

  ngOnInit() {}

  ngOnDestroy(): void {}

  onTagUpdate(model: SharedTagModel) {
    this.updateTag$ = this.eFormTagService
      .updateTag(model)
      .subscribe((data) => {
        if (data && data.success) {
          this.tagsModal.tagEditModal.hide();
          this.tagsModal.show();
          this.tagsChanged.emit();
        }
      });
  }

  onTagCreate(model: SharedTagCreateModel) {
    this.createTag$ = this.eFormTagService
      .createTag(model)
      .subscribe((data) => {
        if (data && data.success) {
          this.tagsModal.tagCreateModal.hide();
          this.tagsModal.show();
          this.tagsChanged.emit();
        }
      });
  }

  onTagDelete(model: SharedTagModel) {
    this.deleteTag$ = this.eFormTagService
      .deleteTag(model.id)
      .subscribe((data) => {
        if (data && data.success) {
          this.tagsModal.tagDeleteModal.hide();
          this.tagsModal.show();
          this.tagsChanged.emit();
        }
      });
  }
}
