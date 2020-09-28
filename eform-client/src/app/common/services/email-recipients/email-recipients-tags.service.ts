import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CommonDictionaryModel,
  DeviceUserModel,
  OperationDataResult,
  OperationResult,
  SharedTagCreateModel,
  SharedTagModel,
} from 'src/app/common/models';
import { BaseService } from '../base.service';

const EmailRecipientsTagsMethods = {
  Main: '/api/email-recipients/tags',
};

@Injectable()
export class EmailRecipientsTagsService extends BaseService {
  constructor(
    private _http: HttpClient,
    router: Router,
    toastrService: ToastrService
  ) {
    super(_http, router, toastrService);
  }

  getEmailRecipientsTags(): Observable<
    OperationDataResult<CommonDictionaryModel[]>
  > {
    return this.get<SharedTagModel[]>(EmailRecipientsTagsMethods.Main);
  }

  updateEmailRecipientTag(model: SharedTagModel): Observable<OperationResult> {
    return this.put<DeviceUserModel>(EmailRecipientsTagsMethods.Main, model);
  }

  deleteEmailRecipientTag(id: number): Observable<OperationResult> {
    return this.delete(EmailRecipientsTagsMethods.Main + '/' + id);
  }

  createEmailRecipientTag(
    model: SharedTagCreateModel
  ): Observable<OperationResult> {
    return this.post<DeviceUserModel>(EmailRecipientsTagsMethods.Main, model);
  }
}
