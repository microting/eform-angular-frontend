import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {EmailRecipientTagModel} from '../../../../../common/models/email-recipients';
import {Subscription} from 'rxjs';
import {EmailRecipientsTagsService} from '../../../../../common/services/email-recipients';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-email-recipient-tag-delete',
  templateUrl: './email-recipient-tag-delete.component.html',
  styleUrls: ['./email-recipient-tag-delete.component.scss']
})
export class EmailRecipientTagDeleteComponent implements OnInit, OnDestroy {
  @ViewChild('frame') frame;
  @Output() tagDeleted: EventEmitter<void> = new EventEmitter<void>();
  @Output() tagDeleteCancelled: EventEmitter<void> = new EventEmitter<void>();
  tagModel: EmailRecipientTagModel = new EmailRecipientTagModel();
  spinnerStatus = false;
  deleteTag$: Subscription;


  constructor(private tagsService: EmailRecipientsTagsService) {
  }

  show(model: EmailRecipientTagModel) {
    this.tagModel = model;
    this.frame.show();
  }

  ngOnInit() {
  }

  deleteTag() {
    this.spinnerStatus = true;
    this.deleteTag$ = this.tagsService.deleteEmailRecipientTag(this.tagModel.id)
      .subscribe((data) => {
        if (data && data.success) {
          this.frame.hide();
          this.tagDeleted.emit();
        }
        this.spinnerStatus = false;
      });
  }

  cancelDelete() {
    this.frame.hide();
    this.tagDeleteCancelled.emit();
  }

  ngOnDestroy(): void {
  }
}
