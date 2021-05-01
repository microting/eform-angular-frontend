import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CommonDictionaryModel,
  DeviceUserModel,
  OperationDataResult,
  OperationResult,
  SharedTagCreateModel,
  SharedTagModel,
} from '../../../../common/models';
import { BaseService } from '../../../../common/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export let ItemsPlanningTagsMethods = {
  Tags: 'api/items-planning-pn/tags',
};

@Injectable()
export class ItemsPlanningPnTagsService extends BaseService {
  constructor(
    private _http: HttpClient,
    router: Router,
    toastrService: ToastrService
  ) {
    super(_http, router, toastrService);
  }

  getPlanningsTags(): Observable<OperationDataResult<CommonDictionaryModel[]>> {
    return this.get<SharedTagModel[]>(ItemsPlanningTagsMethods.Tags);
  }

  updatePlanningTag(model: SharedTagModel): Observable<OperationResult> {
    return this.put<DeviceUserModel>(ItemsPlanningTagsMethods.Tags, model);
  }

  deletePlanningTag(id: number): Observable<OperationResult> {
    return this.delete(ItemsPlanningTagsMethods.Tags + '/' + id);
  }

  createPlanningTag(model: SharedTagCreateModel): Observable<OperationResult> {
    return this.post<DeviceUserModel>(ItemsPlanningTagsMethods.Tags, model);
  }
}
