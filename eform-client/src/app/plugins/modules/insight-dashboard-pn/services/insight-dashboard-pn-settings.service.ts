import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from '../../../../common/models';
import {InsightDashboardBaseSettingsModel} from '../models';

export const InsightDashboardSettingsMethods = {
  Settings: 'api/insight-dashboard-pn/settings'
};

@Injectable()
export class InsightDashboardPnSettingsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllSettings(): Observable<OperationDataResult<any>> {
    return this.get(InsightDashboardSettingsMethods.Settings);
  }

  updateSettings(model: InsightDashboardBaseSettingsModel): Observable<OperationResult> {
    return this.post(InsightDashboardSettingsMethods.Settings, model);
  }
}
