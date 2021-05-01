import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from '../../../../common/models';
import {OuterInnerResourceBaseSettingsModel} from '../models';
import {BaseService} from '../../../../common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

export let OuterInnerResourceSettingsMethods = {
  MachineAreaSettings: 'api/outer-inner-resource-pn/settings'

};
@Injectable()
export class OuterInnerResourcePnSettingsService extends BaseService {

  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllSettings(): Observable<OperationDataResult<OuterInnerResourceBaseSettingsModel>> {
    return this.get(OuterInnerResourceSettingsMethods.MachineAreaSettings);
  }
  updateSettings(model: OuterInnerResourceBaseSettingsModel): Observable<OperationResult> {
    return this.post(OuterInnerResourceSettingsMethods.MachineAreaSettings, model);
  }
}
