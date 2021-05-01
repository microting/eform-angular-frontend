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
  TrashInspectionPnModel,
  TrashInspectionPnUpdateModel,
  TrashInspectionsPnRequestModel,
  TrashInspectionVersionsPnModel,
} from '../models';
import { Paged } from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

export let TrashInspectionPnTrashInspectionMethods = {
  TrashInspectionsIndex: 'api/trash-inspection-pn/inspections/index',
  TrashInspections: 'api/trash-inspection-pn/inspections',
  TrashInspectionVersions: 'api/trash-inspection-pn/versions',
};

@Injectable()
export class TrashInspectionPnTrashInspectionsService {
  constructor(private apiBaseService: ApiBaseService) {}

  getAllTrashInspections(
    model: TrashInspectionsPnRequestModel
  ): Observable<OperationDataResult<Paged<TrashInspectionPnModel>>> {
    return this.apiBaseService.post(
      TrashInspectionPnTrashInspectionMethods.TrashInspectionsIndex,
      model
    );
  }

  getSingleTrashInspection(
    trashInspectionId: number
  ): Observable<OperationDataResult<TrashInspectionPnModel>> {
    return this.apiBaseService.get(
      TrashInspectionPnTrashInspectionMethods.TrashInspections +
        '/' +
        trashInspectionId
    );
  }

  getTrashInspectionVersions(
    trashInspectionId: number
  ): Observable<OperationDataResult<TrashInspectionVersionsPnModel>> {
    return this.apiBaseService.get(
      TrashInspectionPnTrashInspectionMethods.TrashInspectionVersions +
        '/' +
        trashInspectionId
    );
  }
  updateTrashInspection(
    model: TrashInspectionPnUpdateModel
  ): Observable<OperationResult> {
    return this.apiBaseService.put(
      TrashInspectionPnTrashInspectionMethods.TrashInspections,
      model
    );
  }

  createTrashInspection(
    model: TrashInspectionPnModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post(
      TrashInspectionPnTrashInspectionMethods.TrashInspections,
      model
    );
  }

  deleteTrashInspection(
    trashInspectionId: number
  ): Observable<OperationResult> {
    return this.apiBaseService.delete(
      TrashInspectionPnTrashInspectionMethods.TrashInspections +
        '/' +
        trashInspectionId
    );
  }
}
