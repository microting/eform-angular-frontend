import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {CommonDictionaryModel} from '../../../../../common/models/common';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {EmailRecipientsService} from '../../../../../common/services/email-recipients';
import {EmailRecipientCreateModel, EmailRecipientsCreateModel} from '../../../../../common/models/email-recipients';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

@AutoUnsubscribe()
@Component({
  selector: 'app-email-recipients-new',
  templateUrl: './email-recipients-new.component.html',
  styleUrls: ['./email-recipients-new.component.scss']
})
export class EmailRecipientsNewComponent implements OnInit, OnDestroy {
  @ViewChild(('frame'), {static: false}) frame;
  @Input() availableTags: CommonDictionaryModel[] = [];
  @Output() emailRecipientsCreated: EventEmitter<void> = new EventEmitter<void>();
  emailRecipientsCreateModel: EmailRecipientsCreateModel = new EmailRecipientsCreateModel();
  spinnerStatus = false;
  createEmailRecipients$: Subscription;
  rawTextareaData = '';


  constructor(private emailRecipientsService: EmailRecipientsService,
              private toastrService: ToastrService,
              private translateService: TranslateService) {
  }

  show() {
    this.frame.show();
  }

  ngOnInit() {
  }

  createEmailRecipients(textAreaData: HTMLTextAreaElement) {
    const rawArray = textAreaData.value.split('\n');
    const filteredArray = rawArray.filter(x => x !== '');

    if (filteredArray.length) {
      const emailRecipients = [] as EmailRecipientCreateModel[];
      for (const line of filteredArray) {
        const data = line.split(',');
        if (data && data[0] && data[1]) {
          emailRecipients.push({name: data[0], email: data[1]});
        } else {
          this.toastrService.error(this.translateService.instant('Email/name text area should have at least one email/name pair'));
          return;
        }
      }

      this.spinnerStatus = true;
      this.createEmailRecipients$ = this.emailRecipientsService.createEmailRecipients({
        ...this.emailRecipientsCreateModel,
        emailRecipientsList: emailRecipients
      })
        .subscribe((data) => {
          if (data && data.success) {
            this.frame.hide();
            this.rawTextareaData = '';
            this.emailRecipientsCreateModel = new EmailRecipientsCreateModel();
            this.emailRecipientsCreated.emit();
          }
          this.spinnerStatus = false;
        });
    } else {
      this.toastrService.error(this.translateService.instant('Email/name text area should have at least one email/name pair'));
    }
  }

  ngOnDestroy(): void {
  }
}
