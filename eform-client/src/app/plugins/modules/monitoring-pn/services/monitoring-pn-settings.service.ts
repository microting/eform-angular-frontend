import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from '../../../../common/models';
import {MonitoringBaseSettingsModel} from '../models';

export let MonitoringSettingsMethods = {
  MonitoringSettings: 'api/monitoring-pn/settings'
};
@Injectable()
export class MonitoringPnSettingsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllSettings(): Observable<OperationDataResult<MonitoringBaseSettingsModel>> {
    return this.get(MonitoringSettingsMethods.MonitoringSettings);
  }

  updateSettings(model: MonitoringBaseSettingsModel): Observable<OperationResult> {
    return this.post(MonitoringSettingsMethods.MonitoringSettings, model);
  }
}
