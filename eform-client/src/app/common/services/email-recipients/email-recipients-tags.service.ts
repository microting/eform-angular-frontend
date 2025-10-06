import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CommonDictionaryModel,
  DeviceUserModel,
  OperationDataResult,
  OperationResult,
  SharedTagCreateModel,
  SharedTagModel,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

const EmailRecipientsTagsMethods = {
  Main: '/api/email-recipients/tags',
};

@Injectable()
export class EmailRecipientsTagsService {
  private apiBaseService = inject(ApiBaseService);


  getEmailRecipientsTags(): Observable<
    OperationDataResult<CommonDictionaryModel[]>
  > {
    return this.apiBaseService.get<SharedTagModel[]>(
      EmailRecipientsTagsMethods.Main
    );
  }

  updateEmailRecipientTag(model: SharedTagModel): Observable<OperationResult> {
    return this.apiBaseService.put<DeviceUserModel>(
      EmailRecipientsTagsMethods.Main,
      model
    );
  }

  deleteEmailRecipientTag(id: number): Observable<OperationResult> {
    return this.apiBaseService.delete(
      EmailRecipientsTagsMethods.Main + '/' + id
    );
  }

  createEmailRecipientTag(
    model: SharedTagCreateModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post<DeviceUserModel>(
      EmailRecipientsTagsMethods.Main,
      model
    );
  }
}
