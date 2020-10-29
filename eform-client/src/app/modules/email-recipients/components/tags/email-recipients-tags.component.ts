import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  CommonDictionaryModel,
  SharedTagCreateModel,
  SharedTagModel,
} from 'src/app/common/models';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { SharedTagsComponent } from 'src/app/common/modules/eform-shared-tags/components';
import { Subscription } from 'rxjs';
import { EmailRecipientsTagsService } from 'src/app/common/services';

@AutoUnsubscribe()
@Component({
  selector: 'app-email-recipients-tags',
  templateUrl: './email-recipients-tags.component.html',
  styleUrls: ['./email-recipients-tags.component.scss'],
})
export class EmailRecipientsTagsComponent implements OnInit, OnDestroy {
  @ViewChild('tagsModal') tagsModal: SharedTagsComponent;
  @Input() availableTags: CommonDictionaryModel[] = [];
  @Output() tagsChanged: EventEmitter<void> = new EventEmitter<void>();
  deleteTag$: Subscription;
  createTag$: Subscription;
  updateTag$: Subscription;

  constructor(private tagsService: EmailRecipientsTagsService) {}

  show() {
    this.tagsModal.show();
  }

  hide() {
    this.tagsModal.hide();
  }

  ngOnInit() {}

  ngOnDestroy(): void {}

  onTagUpdate(model: SharedTagModel) {
    this.updateTag$ = this.tagsService
      .updateEmailRecipientTag(model)
      .subscribe((data) => {
        if (data && data.success) {
          this.tagsModal.tagEditModal.hide();
          this.tagsModal.show();
          this.tagsChanged.emit();
        }
      });
  }

  onTagCreate(model: SharedTagCreateModel) {
    this.createTag$ = this.tagsService
      .createEmailRecipientTag(model)
      .subscribe((data) => {
        if (data && data.success) {
          this.tagsModal.tagCreateModal.hide();
          this.tagsModal.show();
          this.tagsChanged.emit();
        }
      });
  }

  onTagDelete(model: SharedTagModel) {
    this.deleteTag$ = this.tagsService
      .deleteEmailRecipientTag(model.id)
      .subscribe((data) => {
        if (data && data.success) {
          this.tagsModal.tagDeleteModal.hide();
          this.tagsModal.show();
          this.tagsChanged.emit();
        }
      });
  }
}
