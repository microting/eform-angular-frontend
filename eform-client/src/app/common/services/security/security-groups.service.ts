import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import {
  CommonDictionaryModel,
  OperationDataResult,
  OperationResult,
  SecurityGroupSettingsUpdateModel,
} from 'src/app/common/models';
import {
  SecurityGroupModel,
  SecurityGroupsRequestModel,
  SecurityGroupsModel,
  SecurityGroupUpdateModel,
  SecurityGroupCreateModel,
} from 'src/app/common/models/security';
import { BaseService } from 'src/app/common/services/base.service';

const SecurityGroupMethods = {
  SecurityGroups: '/api/security/groups',
  SecurityGroupsDictionary: '/api/security/groups/dictionary',
  SecurityGroupSettings: '/api/security/groups/settings',
};

@Injectable()
export class SecurityGroupsService extends BaseService {
  constructor(
    private _http: HttpClient,
    router: Router,
    toastrService: ToastrService
  ) {
    super(_http, router, toastrService);
  }

  getAllSecurityGroups(
    model: SecurityGroupsRequestModel
  ): Observable<OperationDataResult<SecurityGroupsModel>> {
    return this.get<any>(SecurityGroupMethods.SecurityGroups, model);
  }

  getSecurityGroupsDictionary(): Observable<
    OperationDataResult<CommonDictionaryModel[]>
  > {
    return this.get<any>(SecurityGroupMethods.SecurityGroupsDictionary);
  }

  getSecurityGroup(
    id: number
  ): Observable<OperationDataResult<SecurityGroupModel>> {
    return this.get<any>(SecurityGroupMethods.SecurityGroups + '/' + id);
  }

  createSecurityGroup(
    model: SecurityGroupCreateModel
  ): Observable<OperationResult> {
    return this.post(SecurityGroupMethods.SecurityGroups, model);
  }

  updateSecurityGroup(
    model: SecurityGroupUpdateModel
  ): Observable<OperationResult> {
    return this.put<any>(SecurityGroupMethods.SecurityGroups, model);
  }

  updateSecurityGroupSettings(
    settingsUpdateModel: SecurityGroupSettingsUpdateModel
  ): Observable<OperationResult> {
    return this.put<any>(
      SecurityGroupMethods.SecurityGroupSettings,
      settingsUpdateModel
    );
  }

  deleteSecurityGroup(id: number): Observable<OperationResult> {
    return this.delete(SecurityGroupMethods.SecurityGroups + '/' + id);
  }
}
