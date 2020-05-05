import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AdvEntitySelectableItemModel} from '../../../../../common/models/advanced';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {EmailRecipientTagModel} from '../../../../../common/models/email-recipients';
import {EmailRecipientsTagsService} from '../../../../../common/services/email-recipients';
import {Subscription} from 'rxjs';

@AutoUnsubscribe()
@Component({
  selector: 'app-email-recipient-tag-edit',
  templateUrl: './email-recipient-tag-edit.component.html',
  styleUrls: ['./email-recipient-tag-edit.component.scss']
})
export class EmailRecipientTagEditComponent implements OnInit, OnDestroy {
  @ViewChild('frame') frame;
  @Output() tagUpdated: EventEmitter<void> = new EventEmitter<void>();
  @Output() tagUpdateCancelled: EventEmitter<void> = new EventEmitter<void>();
  tagModel: EmailRecipientTagModel = new EmailRecipientTagModel();
  updateTag$: Subscription;
  constructor(private tagsService: EmailRecipientsTagsService) { }

  ngOnInit() {
  }

  show(model: EmailRecipientTagModel) {
    this.tagModel = model;
    this.frame.show();
  }

  updateItem() {
    this.updateTag$ = this.tagsService.updateEmailRecipientTag(this.tagModel).subscribe((data) => {
      if (data && data.success) {
        this.frame.hide();
        this.tagUpdated.emit();
      }
    });
  }

  ngOnDestroy(): void {
  }

  cancelEdit() {
    this.frame.hide();
    this.tagUpdateCancelled.emit();
  }
}
