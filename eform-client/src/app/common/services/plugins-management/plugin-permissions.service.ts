import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { OperationDataResult, OperationResult } from 'src/app/common/models';
import {
  PluginGroupPermissionsListModel,
  PluginGroupPermissionsUpdateModel,
  PluginPermissionModel,
} from 'src/app/common/models/plugins-management';
import { ApiBaseService } from 'src/app/common/services';

const PluginPermissionsMethods = {
  PluginPermissions: '/api/plugins-permissions',
  PluginGroupPermissions: '/api/plugins-permissions/group-permissions',
};

@Injectable()
export class PluginPermissionsService {
  private apiBaseService = inject(ApiBaseService);


  getPluginPermissions(
    pluginId: number
  ): Observable<OperationDataResult<PluginPermissionModel[]>> {
    return this.apiBaseService.get(
      PluginPermissionsMethods.PluginPermissions + '/' + pluginId
    );
  }

  getPluginGroupPermissions(
    pluginId: number
  ): Observable<OperationDataResult<PluginGroupPermissionsListModel[]>> {
    return this.apiBaseService.get(
      PluginPermissionsMethods.PluginGroupPermissions + '/' + pluginId
    );
  }

  updatePluginGroupPermissions(
    model: PluginGroupPermissionsUpdateModel
  ): Observable<OperationResult> {
    return this.apiBaseService.put(
      PluginPermissionsMethods.PluginGroupPermissions + '/' + model.pluginId,
      model.groupPermissions
    );
  }
}
