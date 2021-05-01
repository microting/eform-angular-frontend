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

import { PlanningAssignSitesModel } from '../models/plannings/planning-assign-sites.model';
import { PairingsModel, PairingUpdateModel } from '../models/pairings';

export let ItemsPlanningPnPairingMethods = {
  Pairings: 'api/items-planning-pn/pairings',
  PairSingle: 'api/items-planning-pn/pairings/single',
};

@Injectable({
  providedIn: 'root',
})
export class ItemsPlanningPnPairingService extends BaseService {
  constructor(
    private _http: HttpClient,
    router: Router,
    toastrService: ToastrService
  ) {
    super(_http, router, toastrService);
  }

  getAllPairings(model: {
    tagIds: number[];
  }): Observable<OperationDataResult<PairingsModel>> {
    return this.post(ItemsPlanningPnPairingMethods.Pairings, model);
  }

  pairSingle(model: PlanningAssignSitesModel): Observable<OperationResult> {
    return this.post(ItemsPlanningPnPairingMethods.PairSingle, model);
  }

  updatePairings(model: PairingUpdateModel[]): Observable<OperationResult> {
    return this.put(ItemsPlanningPnPairingMethods.Pairings, model);
  }
}
