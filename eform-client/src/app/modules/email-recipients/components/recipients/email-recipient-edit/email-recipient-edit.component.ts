import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {EmailRecipientsService} from 'src/app/common/services';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {EmailRecipientModel, EmailRecipientUpdateModel, CommonDictionaryModel} from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@AutoUnsubscribe()
@Component({
    selector: 'app-email-recipient-edit',
    templateUrl: './email-recipient-edit.component.html',
    styleUrls: ['./email-recipient-edit.component.scss'],
    standalone: false
})
export class EmailRecipientEditComponent implements OnInit, OnDestroy {
  availableTags: CommonDictionaryModel[] = [];
  emailRecipientUpdateModel: EmailRecipientUpdateModel = new EmailRecipientUpdateModel;
  updateEmailRecipient$: Subscription;


  constructor(
    private emailRecipientsService: EmailRecipientsService,
    public dialogRef: MatDialogRef<EmailRecipientEditComponent>,
    @Inject(MAT_DIALOG_DATA) data: { emailRecipientUpdateModel: EmailRecipientModel, availableTags: CommonDictionaryModel[] }
  ) {
    this.emailRecipientUpdateModel = {...data.emailRecipientUpdateModel, tagsIds: data.emailRecipientUpdateModel.tags.map(x => x.id)};
    this.availableTags = data.availableTags;
  }

  ngOnInit() {
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

  updateEmailRecipient() {
    this.updateEmailRecipient$ = this.emailRecipientsService.updateEmailRecipient(this.emailRecipientUpdateModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.hide(true);
        }
      });
  }

  ngOnDestroy(): void {
  }
}
