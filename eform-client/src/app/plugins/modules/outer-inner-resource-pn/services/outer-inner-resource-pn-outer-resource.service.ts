import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {OperationDataResult, OperationResult} from 'src/app/common/models/operation.models';
import {BaseService} from 'src/app/common/services/base.service';
import {
  OuterResourcesPnRequestModel,
  OuterResourcesPnModel,
  OuterResourcePnCreateModel,
  OuterResourcePnUpdateModel,
  OuterResourcePnModel
} from '../models';

export let OuterInnerResourcePnOuterResourceMethods = {
  Areas: 'api/outer-inner-resource-pn/outer-resources',
};

@Injectable()
export class OuterInnerResourcePnOuterResourceService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllAreas(model: OuterResourcesPnRequestModel): Observable<OperationDataResult<OuterResourcesPnModel>> {
    return this.get(OuterInnerResourcePnOuterResourceMethods.Areas, model);
  }

  getSingleArea(areaId: number): Observable<OperationDataResult<OuterResourcePnModel>> {
    return this.get(OuterInnerResourcePnOuterResourceMethods.Areas + '/' + areaId);
  }

  updateArea(model: OuterResourcePnUpdateModel): Observable<OperationResult> {
    return this.put(OuterInnerResourcePnOuterResourceMethods.Areas, model);
  }

  createArea(model: OuterResourcePnCreateModel): Observable<OperationResult> {
    return this.post(OuterInnerResourcePnOuterResourceMethods.Areas, model);
  }

  deleteArea(machineId: number): Observable<OperationResult> {
    return this.delete(OuterInnerResourcePnOuterResourceMethods.Areas + '/' + machineId);
  }
}
