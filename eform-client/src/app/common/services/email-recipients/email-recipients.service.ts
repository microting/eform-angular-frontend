import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CommonDictionaryModel,
  DeviceUserModel,
  EmailRecipientModel,
  EmailRecipientsCreateModel,
  EmailRecipientsListModel,
  EmailRecipientsRequestModel,
  EmailRecipientTagCommonModel,
  EmailRecipientUpdateModel,
  OperationDataResult,
  OperationResult,
  Paged,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

const EmailRecipientsMethods = {
  Main: '/api/email-recipients',
};

@Injectable()
export class EmailRecipientsService {
  private apiBaseService = inject(ApiBaseService);


  getEmailRecipients(
    model: EmailRecipientsRequestModel
  ): Observable<OperationDataResult<Paged<EmailRecipientModel>>> {
    return this.apiBaseService.post<Paged<EmailRecipientModel>>(
      EmailRecipientsMethods.Main + '/index',
      model
    );
  }

  getEmailRecipientsAndTags(): Observable<
    OperationDataResult<EmailRecipientTagCommonModel[]>
  > {
    return this.apiBaseService.get<EmailRecipientsListModel>(
      EmailRecipientsMethods.Main + '/common'
    );
  }

  getSimpleEmailRecipients(): Observable<
    OperationDataResult<CommonDictionaryModel[]>
  > {
    return this.apiBaseService.get<CommonDictionaryModel[]>(
      EmailRecipientsMethods.Main + '/simple'
    );
  }

  updateEmailRecipient(
    model: EmailRecipientUpdateModel
  ): Observable<OperationResult> {
    return this.apiBaseService.put<DeviceUserModel>(
      EmailRecipientsMethods.Main,
      model
    );
  }

  deleteEmailRecipient(id: number): Observable<OperationResult> {
    return this.apiBaseService.delete(EmailRecipientsMethods.Main + '/' + id);
  }

  createEmailRecipients(
    model: EmailRecipientsCreateModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post<DeviceUserModel>(
      EmailRecipientsMethods.Main,
      model
    );
  }
}
