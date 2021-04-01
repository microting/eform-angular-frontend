import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CommonDictionaryModel,
  DeviceUserModel,
  EmailRecipientModel,
  EmailRecipientsCreateModel,
  EmailRecipientsListModel,
  EmailRecipientTagCommonModel,
  EmailRecipientUpdateModel,
  OperationDataResult,
  OperationResult,
  Paged,
} from 'src/app/common/models';
import { BaseService } from '../base.service';
import { EmailRecipientsState } from 'src/app/modules/email-recipients/components/state/email-recipients.store';

const EmailRecipientsMethods = {
  Main: '/api/email-recipients',
};

@Injectable()
export class EmailRecipientsService extends BaseService {
  constructor(
    private _http: HttpClient,
    router: Router,
    toastrService: ToastrService
  ) {
    super(_http, router, toastrService);
  }

  getEmailRecipients(
    model: EmailRecipientsState
  ): Observable<OperationDataResult<Paged<EmailRecipientModel>>> {
    return this.post<Paged<EmailRecipientModel>>(
      EmailRecipientsMethods.Main + '/index',
      model
    );
  }

  getEmailRecipientsAndTags(): Observable<
    OperationDataResult<EmailRecipientTagCommonModel[]>
  > {
    return this.get<EmailRecipientsListModel>(
      EmailRecipientsMethods.Main + '/common'
    );
  }

  getSimpleEmailRecipients(): Observable<
    OperationDataResult<CommonDictionaryModel[]>
  > {
    return this.get<CommonDictionaryModel[]>(
      EmailRecipientsMethods.Main + '/simple'
    );
  }

  updateEmailRecipient(
    model: EmailRecipientUpdateModel
  ): Observable<OperationResult> {
    return this.put<DeviceUserModel>(EmailRecipientsMethods.Main, model);
  }

  deleteEmailRecipient(id: number): Observable<OperationResult> {
    return this.delete(EmailRecipientsMethods.Main + '/' + id);
  }

  createEmailRecipients(
    model: EmailRecipientsCreateModel
  ): Observable<OperationResult> {
    return this.post<DeviceUserModel>(EmailRecipientsMethods.Main, model);
  }
}
