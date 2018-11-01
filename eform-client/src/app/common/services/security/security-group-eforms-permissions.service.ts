import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {EformPermissionsNamesSwap} from 'src/app/common/enums';
import {
  EformsPermissionsRequestModel,
  EformsPermissionsModel,
  OperationDataResult,
  OperationResult,
  TemplateListModel, TemplateRequestModel, EformPermissionsModel, EformBindGroupModel, EformPermissionsSimpleModel
} from 'src/app/common/models';
import {BaseService} from 'src/app/common/services/base.service';

const SecurityGroupEformsPermissionsMethods = {
  SecurityGroupEforms: 'api/security/eforms',
  SecurityGroupEformsPermissions: 'api/security/eforms-permissions'
};

@Injectable()
export class SecurityGroupEformsPermissionsService extends BaseService {
  mappedPermissions: Array<EformPermissionsSimpleModel> = [];

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

  getEformsSimplePermissions(): Observable<OperationDataResult<Array<EformPermissionsSimpleModel>>> {
    return this.get(SecurityGroupEformsPermissionsMethods.SecurityGroupEformsPermissions + '/simple');
  }

  mapEformsSimplePermissions(model: Array<EformPermissionsSimpleModel>) {
    if (model.length) {
      const newModel: Array<EformPermissionsSimpleModel> = [];
      for (const eformSimplePermissionModel of model) {
        const newArrayPermissions: Array<string> = [];
        for (const permissionName of eformSimplePermissionModel.permissionsSimpleList) {
          newArrayPermissions.push(EformPermissionsNamesSwap.find(x => x.originalName === permissionName).swappedName);
        }
        const eformModel = new EformPermissionsSimpleModel();
        eformModel.templateId = eformSimplePermissionModel.templateId;
        eformModel.permissionsSimpleList = newArrayPermissions;
        newModel.push(eformModel);
      }
      this.mappedPermissions = newModel;
      return this.mappedPermissions;
    } return [];
  }
}
