import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models/operation.models';
import { BaseService } from 'src/app/common/services/base.service';

import {
  PlanningCreateModel,
  PlanningModel,
  PlanningsRequestModel,
  PlanningUpdateModel,
} from '../models/plannings';
import { Paged } from 'src/app/common/models';

export let ItemsPlanningPnPlanningsMethods = {
  Plannings: 'api/items-planning-pn/plannings',
  PlanningsAssign: 'api/items-planning-pn/plannings/assign-sites',
};

@Injectable({
  providedIn: 'root',
})
export class ItemsPlanningPnPlanningsService extends BaseService {
  constructor(
    private _http: HttpClient,
    router: Router,
    toastrService: ToastrService
  ) {
    super(_http, router, toastrService);
  }

  getAllPlannings(
    model: PlanningsRequestModel
  ): Observable<OperationDataResult<Paged<PlanningModel>>> {
    return this.post(
      ItemsPlanningPnPlanningsMethods.Plannings + '/index',
      model
    );
  }

  getSinglePlanning(
    planningId: number
  ): Observable<OperationDataResult<PlanningModel>> {
    return this.get(
      ItemsPlanningPnPlanningsMethods.Plannings + '/' + planningId
    );
  }

  updatePlanning(model: PlanningUpdateModel): Observable<OperationResult> {
    return this.put(ItemsPlanningPnPlanningsMethods.Plannings, model);
  }

  createPlanning(model: PlanningCreateModel): Observable<OperationResult> {
    return this.post(ItemsPlanningPnPlanningsMethods.Plannings, model);
  }

  deletePlanning(fractionId: number): Observable<OperationResult> {
    return this.delete(
      ItemsPlanningPnPlanningsMethods.Plannings + '/' + fractionId
    );
  }

  deletePlannings(planningsIds: number[]): Observable<OperationResult> {
    return this.post(
      ItemsPlanningPnPlanningsMethods.Plannings + '/delete-multiple',
      planningsIds
    );
  }

  importPlanningsFromExcel(excelFile: File): Observable<OperationResult> {
    return this.uploadFile(
      ItemsPlanningPnPlanningsMethods.Plannings + '/import',
      excelFile
    );
  }
}
