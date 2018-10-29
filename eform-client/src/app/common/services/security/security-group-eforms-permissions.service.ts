import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {
  EformsPermissionsRequestModel,
  EformsPermissionsModel,
  OperationDataResult,
  OperationResult,
  TemplateListModel, TemplateRequestModel
} from 'src/app/common/models';
import {BaseService} from 'src/app/common/services/base.service';

const SecurityGroupEformsPermissionsMethods = {
  SecurityGroupEformsPermissions: '/api/security/group/general-permissions'
};

@Injectable()
export class SecurityGroupEformsPermissionsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAvailableEformsForGroup(model: TemplateRequestModel): Observable<OperationDataResult<TemplateListModel>> {
    return this.get(SecurityGroupEformsPermissionsMethods.SecurityGroupEformsPermissions, model);
  }

  getGroupEforms(groupId: number): Observable<OperationDataResult<EformsPermissionsModel>> {
    return this.get(SecurityGroupEformsPermissionsMethods.SecurityGroupEformsPermissions + '/' + groupId);
  }

  addEformToGroup(eformId: number): Observable<OperationResult> {
    return this.post(SecurityGroupEformsPermissionsMethods.SecurityGroupEformsPermissions, eformId);
  }
}
