import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from 'src/app/common/models';
import {
  PluginsSettingsModel,
  PluginsSettingsRequestModel,
  PluginsSettingsUpdateModel
} from 'src/app/common/models/settings/plugins';
import {BaseService} from 'src/app/common/services/base.service';

const PluginsSettingsMethods = {
  Settings: '/api/plugins-settings/connection-string',
};

@Injectable()
export class PluginsSettingsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllPluginsSettings(model: PluginsSettingsRequestModel): Observable<OperationDataResult<PluginsSettingsModel>> {
    return this.get(PluginsSettingsMethods.Settings, model);
  }
  updatePluginSettings(model: PluginsSettingsUpdateModel): Observable<OperationResult> {
    return this.post(PluginsSettingsMethods.Settings, model);
  }
}
