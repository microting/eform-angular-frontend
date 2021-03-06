import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {CommonDictionaryModel} from '../../../../../common/models/common';
import {EmailRecipientModel} from '../../../../../common/models/email-recipients';
import {Subscription} from 'rxjs';
import {EmailRecipientsService} from '../../../../../common/services/email-recipients';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-email-recipient-delete',
  templateUrl: './email-recipient-delete.component.html',
  styleUrls: ['./email-recipient-delete.component.scss']
})
export class EmailRecipientDeleteComponent implements OnInit, OnDestroy {
  @ViewChild('frame') frame;
  @Input() availableTags: CommonDictionaryModel[] = [];
  @Output() emailRecipientDeleted: EventEmitter<void> = new EventEmitter<void>();
  selectedEmailRecipient: EmailRecipientModel = new EmailRecipientModel;
  deleteEmailRecipient$: Subscription;


  constructor(private emailRecipientsService: EmailRecipientsService) {
  }

  show(model: EmailRecipientModel) {
    this.selectedEmailRecipient = model;
    this.frame.show();
  }

  ngOnInit() {
  }

  deleteEmailRecipient() {
    this.deleteEmailRecipient$ = this.emailRecipientsService.deleteEmailRecipient(this.selectedEmailRecipient.id)
      .subscribe((data) => {
        if (data && data.success) {
          this.frame.hide();
          this.emailRecipientDeleted.emit();
        }
      });
  }

  ngOnDestroy(): void {
  }
}
