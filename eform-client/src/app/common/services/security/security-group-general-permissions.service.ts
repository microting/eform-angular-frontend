import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  OperationResult,
  SecurityGroupGeneralPermissionsModel,
  SecurityGroupGeneralPermissionsUpdateModel,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

const SecurityGroupGeneralPermissionsMethods = {
  SecurityGroupGeneralPermissions: '/api/security/permissions',
};

@Injectable()
export class SecurityGroupGeneralPermissionsService {
  private apiBaseService = inject(ApiBaseService);


  getGeneralPermissions(
    groupId: number
  ): Observable<OperationDataResult<SecurityGroupGeneralPermissionsModel>> {
    return this.apiBaseService.get(
      SecurityGroupGeneralPermissionsMethods.SecurityGroupGeneralPermissions +
        '/' +
        groupId
    );
  }

  updateGeneralPermissions(
    model: SecurityGroupGeneralPermissionsUpdateModel
  ): Observable<OperationResult> {
    return this.apiBaseService.put(
      SecurityGroupGeneralPermissionsMethods.SecurityGroupGeneralPermissions,
      model
    );
  }
}
