import {Component, Inject, OnDestroy, OnInit,} from '@angular/core';
import {CommonDictionaryModel, EmailRecipientCreateModel, EmailRecipientsCreateModel} from 'src/app/common/models';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {EmailRecipientsService} from 'src/app/common/services';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@AutoUnsubscribe()
@Component({
  selector: 'app-email-recipients-new',
  templateUrl: './email-recipients-new.component.html',
  styleUrls: ['./email-recipients-new.component.scss']
})
export class EmailRecipientsNewComponent implements OnInit, OnDestroy {
  emailRecipientsCreateModel: EmailRecipientsCreateModel = new EmailRecipientsCreateModel();
  createEmailRecipients$: Subscription;
  rawTextareaData = '';

  constructor(
    private emailRecipientsService: EmailRecipientsService,
    private toastrService: ToastrService,
    private translateService: TranslateService,
    public dialogRef: MatDialogRef<EmailRecipientsNewComponent>,
    @Inject(MAT_DIALOG_DATA) public availableTags: CommonDictionaryModel[] = [],
  ) {
  }

  ngOnInit() {
  }

  hide(result = false) {
    this.dialogRef.close(result);
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
      this.createEmailRecipients$ = this.emailRecipientsService.createEmailRecipients({
        ...this.emailRecipientsCreateModel,
        emailRecipientsList: emailRecipients
      }).subscribe((data) => {
        if (data && data.success) {
          this.hide(true);
        }
      });
    } else {
      this.toastrService.error(this.translateService.instant('Email/name text area should have at least one email/name pair'));
    }
  }

  ngOnDestroy(): void {
  }
}
