import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  DeviceUserModel,
  EmailRecipientsCreateModel,
  EmailRecipientsListModel,
  EmailRecipientsRequestModel, EmailRecipientTagCommonModel,
  EmailRecipientUpdateModel,
  OperationDataResult,
  OperationResult
} from 'src/app/common/models';
import {BaseService} from '../base.service';

const EmailRecipientsMethods = {
  Main: '/api/email-recipients'
};

@Injectable()
export class EmailRecipientsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getEmailRecipients(model: EmailRecipientsRequestModel): Observable<OperationDataResult<EmailRecipientsListModel>> {
    return this.post<EmailRecipientsListModel>(EmailRecipientsMethods.Main + '/index', model);
  }

  getEmailRecipientsAndTags(): Observable<OperationDataResult<EmailRecipientTagCommonModel[]>> {
    return this.get<EmailRecipientsListModel>(EmailRecipientsMethods.Main + '/common');
  }

  updateEmailRecipient(model: EmailRecipientUpdateModel): Observable<OperationResult> {
    return this.put<DeviceUserModel>(EmailRecipientsMethods.Main, model);
  }

  deleteEmailRecipient(id: number): Observable<OperationResult> {
    return this.delete(EmailRecipientsMethods.Main + '/' + id);
  }

  createEmailRecipients(model: EmailRecipientsCreateModel): Observable<OperationResult> {
    return this.post<DeviceUserModel>(EmailRecipientsMethods.Main, model);
  }
}

