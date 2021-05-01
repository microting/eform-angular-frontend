import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from '../../../../common/models';
import {BaseService} from '../../../../common/services/base.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ItemsGroupPlanningBaseSettingsModel} from '../models/items-group-planning-base-settings.model';

export let ItemsGroupPlanningSettingsMethods = {
  ItemsGroupPlanningSettings: 'api/items-group-planning-pn/settings'

};
@Injectable()
export class ItemsGroupPlanningPnSettingsService extends BaseService {

  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllSettings(): Observable<OperationDataResult<ItemsGroupPlanningBaseSettingsModel>> {
    return this.get(ItemsGroupPlanningSettingsMethods.ItemsGroupPlanningSettings);
  }
  updateSettings(model: ItemsGroupPlanningBaseSettingsModel): Observable<OperationResult> {
    return this.post(ItemsGroupPlanningSettingsMethods.ItemsGroupPlanningSettings, model);
  }
}
