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
  TemplateListModel, TemplateRequestModel, EformPermissionsModel, EformBindGroupModel
} from 'src/app/common/models';
import {BaseService} from 'src/app/common/services/base.service';

const SecurityGroupEformsPermissionsMethods = {
  SecurityGroupEforms: 'api/security/eforms',
  SecurityGroupEformsPermissions: 'api/security/eforms-permissions'
};

@Injectable()
export class SecurityGroupEformsPermissionsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAvailableEformsForGroup(model: TemplateRequestModel, groupId: number): Observable<OperationDataResult<TemplateListModel>> {
    return this.get(SecurityGroupEformsPermissionsMethods.SecurityGroupEforms + '/' + groupId, model);
  }

  getGroupEforms(groupId: number): Observable<OperationDataResult<EformsPermissionsModel>> {
    return this.get(SecurityGroupEformsPermissionsMethods.SecurityGroupEformsPermissions + '/' + groupId);
  }

  addEformToGroup(model: EformBindGroupModel): Observable<OperationResult> {
    return this.put(SecurityGroupEformsPermissionsMethods.SecurityGroupEforms, model);
  }

  updateGroupEformPermissions(model: EformPermissionsModel): Observable<OperationDataResult<EformsPermissionsModel>> {
    return this.post(SecurityGroupEformsPermissionsMethods.SecurityGroupEformsPermissions, model);
  }

  deleteEformFromGroup(model: any): Observable<OperationResult> {
    return this.delete(SecurityGroupEformsPermissionsMethods.SecurityGroupEforms +
      '/' + model.eformId + '/' + model.groupId);
  }
}
