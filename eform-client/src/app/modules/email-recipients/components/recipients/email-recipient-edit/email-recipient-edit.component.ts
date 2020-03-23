import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {CommonDictionaryModel} from '../../../../../common/models/common';
import {Subscription} from 'rxjs';
import {EmailRecipientsService} from '../../../../../common/services/email-recipients';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {EmailRecipientModel, EmailRecipientUpdateModel} from '../../../../../common/models/email-recipients';

@AutoUnsubscribe()
@Component({
  selector: 'app-email-recipient-edit',
  templateUrl: './email-recipient-edit.component.html',
  styleUrls: ['./email-recipient-edit.component.scss']
})
export class EmailRecipientEditComponent implements OnInit, OnDestroy {
  @ViewChild('frame', {static: false}) frame;
  @Input() availableTags: CommonDictionaryModel[] = [];
  @Output() emailRecipientUpdated: EventEmitter<void> = new EventEmitter<void>();
  emailRecipientUpdateModel: EmailRecipientUpdateModel = new EmailRecipientUpdateModel;
  spinnerStatus = false;
  updateEmailRecipient$: Subscription;


  constructor(private emailRecipientsService: EmailRecipientsService) {
  }

  show(model: EmailRecipientModel) {
    this.emailRecipientUpdateModel = {id: model.id, name: model.name, email: model.email, tagsIds: model.tags.map(x => x.id)};
    this.frame.show();
  }

  ngOnInit() {
  }

  updateEmailRecipient() {
    this.spinnerStatus = true;
    this.updateEmailRecipient$ = this.emailRecipientsService.updateEmailRecipient(this.emailRecipientUpdateModel)
      .subscribe((data) => {
      if (data && data.success) {
        this.frame.hide();
        this.emailRecipientUpdated.emit();
        this.emailRecipientUpdateModel = new EmailRecipientUpdateModel;
      }
      this.spinnerStatus = false;
    });
  }

  ngOnDestroy(): void {
  }
}
