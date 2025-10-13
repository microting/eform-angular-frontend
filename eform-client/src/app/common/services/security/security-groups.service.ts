import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CommonDictionaryModel,
  OperationDataResult,
  OperationResult,
  Paged,
  SecurityGroupSettingsUpdateModel,
} from 'src/app/common/models';
import {
  SecurityGroupModel,
  SecurityGroupsRequestModel,
  SecurityGroupUpdateModel,
  SecurityGroupCreateModel,
} from 'src/app/common/models/security';
import { ApiBaseService } from 'src/app/common/services';

const SecurityGroupMethods = {
  SecurityGroups: '/api/security/groups',
  SecurityGroupsIndex: '/api/security/groups/index',
  SecurityGroupsDictionary: '/api/security/groups/dictionary',
  SecurityGroupSettings: '/api/security/groups/settings',
};

@Injectable()
export class SecurityGroupsService {
  private apiBaseService = inject(ApiBaseService);


  getAllSecurityGroups(
    model: SecurityGroupsRequestModel
  ): Observable<OperationDataResult<Paged<SecurityGroupModel>>> {
    return this.apiBaseService.post<Paged<SecurityGroupModel>>(
      SecurityGroupMethods.SecurityGroupsIndex,
      model
    );
  }

  getSecurityGroupsDictionary(): Observable<
    OperationDataResult<CommonDictionaryModel[]>
  > {
    return this.apiBaseService.get<any>(
      SecurityGroupMethods.SecurityGroupsDictionary
    );
  }

  getSecurityGroup(
    id: number
  ): Observable<OperationDataResult<SecurityGroupModel>> {
    return this.apiBaseService.get<any>(
      SecurityGroupMethods.SecurityGroups + '/' + id
    );
  }

  createSecurityGroup(
    model: SecurityGroupCreateModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post(SecurityGroupMethods.SecurityGroups, model);
  }

  updateSecurityGroup(
    model: SecurityGroupUpdateModel
  ): Observable<OperationResult> {
    return this.apiBaseService.put<any>(
      SecurityGroupMethods.SecurityGroups,
      model
    );
  }

  updateSecurityGroupSettings(
    settingsUpdateModel: SecurityGroupSettingsUpdateModel
  ): Observable<OperationResult> {
    return this.apiBaseService.put<any>(
      SecurityGroupMethods.SecurityGroupSettings,
      settingsUpdateModel
    );
  }

  deleteSecurityGroup(id: number): Observable<OperationResult> {
    return this.apiBaseService.delete(
      SecurityGroupMethods.SecurityGroups + '/' + id
    );
  }
}
