import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models/operation.models';
import {
  TransporterPnImportModel,
  TransporterPnModel,
  TransporterPnRequestModel,
  TransporterPnStatsByYearModel,
  TransporterPnUpdateModel,
  TransportersPnModel,
  TransporterYearPnRequestModel,
  StatByMonthPnModel,
} from '../models';
import { Paged } from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

export let TrashInspectionPnTransporterMethods = {
  Transporter: 'api/trash-inspection-pn/transporters',
  ProducersStatsByYear: 'api/trash-inspection-pn/producers/stats-by-year',
};

@Injectable({
  providedIn: 'root',
})
export class TrashInspectionPnTransporterService {
  constructor(private apiBaseService: ApiBaseService) {}

  getAllTransporters(
    model: TransporterPnRequestModel
  ): Observable<OperationDataResult<TransportersPnModel>> {
    return this.apiBaseService.get(
      TrashInspectionPnTransporterMethods.Transporter,
      model
    );
  }

  getSingleTransporter(
    transporterId: number
  ): Observable<OperationDataResult<TransporterPnModel>> {
    return this.apiBaseService.get(
      TrashInspectionPnTransporterMethods.Transporter + '/' + transporterId
    );
  }

  getSingleTransporterByMonth(
    transporterId: number,
    year: number
  ): Observable<OperationDataResult<StatByMonthPnModel>> {
    return this.apiBaseService.get(
      TrashInspectionPnTransporterMethods.Transporter +
        '/' +
        transporterId +
        '/' +
        year
    );
  }

  updateTransporter(
    model: TransporterPnUpdateModel
  ): Observable<OperationResult> {
    return this.apiBaseService.put(
      TrashInspectionPnTransporterMethods.Transporter,
      model
    );
  }

  createTransporter(model: TransporterPnModel): Observable<OperationResult> {
    return this.apiBaseService.post(
      TrashInspectionPnTransporterMethods.Transporter,
      model
    );
  }

  deleteTransporter(transporterId: number): Observable<OperationResult> {
    return this.apiBaseService.delete(
      TrashInspectionPnTransporterMethods.Transporter + '/' + transporterId
    );
  }
  importTransporter(
    model: TransporterPnImportModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post(
      TrashInspectionPnTransporterMethods.Transporter + '/import',
      model
    );
  }
  getAllTransportersByYear(
    model: TransporterYearPnRequestModel
  ): Observable<OperationDataResult<Paged<TransporterPnStatsByYearModel>>> {
    return this.apiBaseService.post(
      TrashInspectionPnTransporterMethods.ProducersStatsByYear,
      model
    );
  }
}
