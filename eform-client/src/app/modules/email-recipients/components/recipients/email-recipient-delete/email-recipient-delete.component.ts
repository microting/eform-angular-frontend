import {Component, Inject, OnDestroy, OnInit,} from '@angular/core';
import {EmailRecipientModel} from 'src/app/common/models';
import {Subscription} from 'rxjs';
import {EmailRecipientsService} from 'src/app/common/services';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@AutoUnsubscribe()
@Component({
    selector: 'app-email-recipient-delete',
    templateUrl: './email-recipient-delete.component.html',
    styleUrls: ['./email-recipient-delete.component.scss'],
    standalone: false
})
export class EmailRecipientDeleteComponent implements OnInit, OnDestroy {
  deleteEmailRecipient$: Subscription;

  constructor(
    private emailRecipientsService: EmailRecipientsService,
    public dialogRef: MatDialogRef<EmailRecipientDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedEmailRecipient: EmailRecipientModel = new EmailRecipientModel()) {
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

  ngOnInit() {
  }

  deleteEmailRecipient() {
    this.deleteEmailRecipient$ = this.emailRecipientsService.deleteEmailRecipient(this.selectedEmailRecipient.id)
      .subscribe((data) => {
        if (data && data.success) {
          this.hide(true);
        }
      });
  }

  ngOnDestroy(): void {
  }
}
