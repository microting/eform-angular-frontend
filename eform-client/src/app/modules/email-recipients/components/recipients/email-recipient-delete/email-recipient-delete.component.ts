import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {EmailRecipientModel} from 'src/app/common/models';
import {Subscription} from 'rxjs';
import {EmailRecipientsService} from 'src/app/common/services';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@AutoUnsubscribe()
@Component({
    selector: 'app-email-recipient-delete',
    templateUrl: './email-recipient-delete.component.html',
    styleUrls: ['./email-recipient-delete.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, TranslatePipe]
})
export class EmailRecipientDeleteComponent implements OnInit, OnDestroy {
  private emailRecipientsService = inject(EmailRecipientsService);
  dialogRef = inject<MatDialogRef<EmailRecipientDeleteComponent>>(MatDialogRef);
  selectedEmailRecipient = inject<EmailRecipientModel>(MAT_DIALOG_DATA) ?? new EmailRecipientModel();

  deleteEmailRecipient$: Subscription;

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
