import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {OperationDataResult, OperationResult} from 'src/app/common/models/operation.models';
import {BaseService} from 'src/app/common/services/base.service';
import {CustomersPnSettingsModel} from '../models';

export let CustomerPnSettingsMethods = {
  CustomersPnSettings: 'api/customers-pn/settings'
};

@Injectable()
export class CustomersPnSettingsService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllSettings(): Observable<OperationDataResult<CustomersPnSettingsModel>> {
    return this.get(CustomerPnSettingsMethods.CustomersPnSettings);
  }

  updateSettings(model: CustomersPnSettingsModel): Observable<OperationResult> {
    return this.post(CustomerPnSettingsMethods.CustomersPnSettings, model);
  }
}
