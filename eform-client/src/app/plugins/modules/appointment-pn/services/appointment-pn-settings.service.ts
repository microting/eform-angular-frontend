import {Injectable} from '@angular/core';
import {BaseService} from '../../../../common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from '../../../../common/models';
import {AppointmentBaseSettingsModel} from '../models/appointment-base-settings.model';

export let AppointmentSettingsMethods = {
  AppointmentSettings: 'api/appointment-pn/settings'
};
@Injectable()
export class AppointmentPnSettingsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllSettings(): Observable<OperationDataResult<AppointmentBaseSettingsModel>> {
    return this.get(AppointmentSettingsMethods.AppointmentSettings);
  }

  updateSettings(model: AppointmentBaseSettingsModel): Observable<OperationResult> {
    return this.post(AppointmentSettingsMethods.AppointmentSettings, model);
  }
}
