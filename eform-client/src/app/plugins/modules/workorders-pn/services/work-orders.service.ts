import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/common/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  OperationResult,
} from '../../../../common/models';
import { WorkOrdersModel, WorkOrdersRequestModel } from '../models';

export let WorkOrdersMethods = {
  WorkOrders: 'api/workorders-pn',
};

@Injectable()
export class WorkOrdersService extends BaseService {
  constructor(
    private _http: HttpClient,
    router: Router,
    toastrService: ToastrService
  ) {
    super(_http, router, toastrService);
  }

  getAllWorkOrders(
    model: WorkOrdersRequestModel
  ): Observable<OperationDataResult<WorkOrdersModel>> {
    return this.post(WorkOrdersMethods.WorkOrders, model);
  }

  deleteWorkOrder(id: number): Observable<OperationResult> {
    return this.delete(WorkOrdersMethods.WorkOrders + '/' + id);
  }
}
