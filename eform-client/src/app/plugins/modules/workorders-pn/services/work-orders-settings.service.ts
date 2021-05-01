import {Injectable} from '@angular/core';
import {BaseService} from 'src/app/common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from '../../../../common/models';
import {WorkOrdersSettingsModel} from '../models';

export let WorkOrdersSettingsMethods = {
  Settings: 'api/workorders-pn/settings',
  SettingsSites: 'api/workorders-pn/settings/sites',
  SettingsFolder: 'api/workorders-pn/settings/folder',
  SettingsTasksFolder: 'api/workorders-pn/settings/tasksfolder'
};
@Injectable()
export class WorkOrdersSettingsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllSettings(): Observable<OperationDataResult<WorkOrdersSettingsModel>> {
    return this.get(WorkOrdersSettingsMethods.Settings);
  }

  addSiteToSettings(siteId: number): Observable<OperationResult> {
    return this.post(WorkOrdersSettingsMethods.SettingsSites, siteId);
  }

  removeSiteFromSettings(id: number): Observable<OperationResult> {
    return this.delete(WorkOrdersSettingsMethods.SettingsSites + '/' + id);
  }

  updateSettingsFolder(folderId: number): Observable<OperationResult> {
    return this.post(WorkOrdersSettingsMethods.SettingsFolder, folderId);
  }

  updateSettingsTasksFolder(folderId: number): Observable<OperationResult> {
    return this.post(WorkOrdersSettingsMethods.SettingsTasksFolder, folderId);
  }
}
