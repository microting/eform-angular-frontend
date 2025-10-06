import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { EformPermissionsNamesSwap } from 'src/app/common/const';
import {
  EformsPermissionsModel,
  OperationDataResult,
  OperationResult,
  TemplateListModel,
  TemplateRequestModel,
  EformPermissionsModel,
  EformBindGroupModel,
  EformPermissionsSimpleModel,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

const SecurityGroupEformsPermissionsMethods = {
  SecurityGroupEforms: 'api/security/eforms',
  SecurityGroupEformsPermissions: 'api/security/eforms-permissions',
};

@Injectable()
export class SecurityGroupEformsPermissionsService {
  private apiBaseService = inject(ApiBaseService);

  mappedPermissions: Array<EformPermissionsSimpleModel> = [];

  getAvailableEformsForGroup(
    model: TemplateRequestModel,
    groupId: number
  ): Observable<OperationDataResult<TemplateListModel>> {
    return this.apiBaseService.get(
      SecurityGroupEformsPermissionsMethods.SecurityGroupEforms + '/' + groupId,
      model
    );
  }

  getGroupEforms(
    groupId: number
  ): Observable<OperationDataResult<EformsPermissionsModel>> {
    return this.apiBaseService.get(
      SecurityGroupEformsPermissionsMethods.SecurityGroupEformsPermissions +
        '/' +
        groupId
    );
  }

  addEformToGroup(model: EformBindGroupModel): Observable<OperationResult> {
    return this.apiBaseService.put(
      SecurityGroupEformsPermissionsMethods.SecurityGroupEforms,
      model
    );
  }

  updateGroupEformPermissions(
    model: EformPermissionsModel
  ): Observable<OperationDataResult<EformsPermissionsModel>> {
    return this.apiBaseService.post(
      SecurityGroupEformsPermissionsMethods.SecurityGroupEformsPermissions,
      model
    );
  }

  deleteEformFromGroup(model: any): Observable<OperationResult> {
    return this.apiBaseService.delete(
      SecurityGroupEformsPermissionsMethods.SecurityGroupEforms +
        '/' +
        model.eformId +
        '/' +
        model.groupId
    );
  }

  getEformsSimplePermissions(): Observable<
    OperationDataResult<Array<EformPermissionsSimpleModel>>
  > {
    return this.apiBaseService.get(
      SecurityGroupEformsPermissionsMethods.SecurityGroupEformsPermissions +
        '/simple'
    );
  }

  mapEformsSimplePermissions(model: Array<EformPermissionsSimpleModel>) {
    if (model.length) {
      const newModel: Array<EformPermissionsSimpleModel> = [];
      for (const eformSimplePermissionModel of model) {
        const newArrayPermissions: Array<string> = [];
        for (const permissionName of eformSimplePermissionModel.permissionsSimpleList) {
          const foundPermission = EformPermissionsNamesSwap.find(
            (x) => x.originalName === permissionName
          );
          if (foundPermission) {
            newArrayPermissions.push(foundPermission.swappedName);
          }
        }
        const eformModel = new EformPermissionsSimpleModel();
        eformModel.templateId = eformSimplePermissionModel.templateId;
        eformModel.permissionsSimpleList = newArrayPermissions;
        newModel.push(eformModel);
      }
      this.mappedPermissions = newModel;
      return this.mappedPermissions;
    }
    return [];
  }
}
