import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from 'src/app/common/models';
import {
  PluginGroupPermissionsListModel, PluginGroupPermissionsUpdateModel,
  PluginPermissionModel
} from 'src/app/common/models/plugins-management';
import {BaseService} from 'src/app/common/services/base.service';

const PluginPermissionsMethods = {
  PluginPermissions: '/api/plugins-permissions',
  PluginGroupPermissions: '/api/plugins-permissions/group-permissions',
};

@Injectable()
export class PluginPermissionsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getPluginPermissions(pluginId: number): Observable<OperationDataResult<PluginPermissionModel[]>> {
    return this.get(PluginPermissionsMethods.PluginPermissions + '/' + pluginId);
  }

  getPluginGroupPermissions(pluginId: number): Observable<OperationDataResult<PluginGroupPermissionsListModel[]>> {
    return this.get(PluginPermissionsMethods.PluginGroupPermissions + '/' + pluginId);
  }

  updatePluginGroupPermissions(model: PluginGroupPermissionsUpdateModel): Observable<OperationResult> {
    return this.put(PluginPermissionsMethods.PluginGroupPermissions + '/' + model.pluginId, model.groupPermissions);
  }
}
