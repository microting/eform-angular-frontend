import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from '../../../../common/models';
import {BaseService} from '../../../../common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ItemsPlanningBaseSettingsModel} from '../models/items-planning-base-settings.model';

export let ItemsPlanningSettingsMethods = {
  ItemsPlanningSettings: 'api/items-planning-pn/settings'

};
@Injectable()
export class ItemsPlanningPnSettingsService extends BaseService {

  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllSettings(): Observable<OperationDataResult<ItemsPlanningBaseSettingsModel>> {
    return this.get(ItemsPlanningSettingsMethods.ItemsPlanningSettings);
  }
  updateSettings(model: ItemsPlanningBaseSettingsModel): Observable<OperationResult> {
    return this.post(ItemsPlanningSettingsMethods.ItemsPlanningSettings, model);
  }
}
