import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models/operation.models';
import {
  FractionPnImportModel,
  FractionPnModel,
  FractionPnRequestModel,
  FractionPnStatsByYearModel,
  FractionPnUpdateModel,
  FractionPnYearRequestModel,
  StatByMonthPnModel,
} from '../models';
import { Paged } from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

export let TrashInspectionPnFractionMethods = {
  Fractions: 'api/trash-inspection-pn/fractions',
  FractionsIndex: 'api/trash-inspection-pn/fractions/index',
  FractionsStatsByYear: 'api/trash-inspection-pn/fractions/stats-by-year',
  FractionsImport: 'api/trash-inspection-pn/fractions/import',
};
@Injectable({
  providedIn: 'root',
})
export class TrashInspectionPnFractionsService {
  constructor(private apiBaseService: ApiBaseService) {}

  getAllFractions(
    model: FractionPnRequestModel
  ): Observable<OperationDataResult<Paged<FractionPnModel>>> {
    return this.apiBaseService.post(
      TrashInspectionPnFractionMethods.FractionsIndex,
      model
    );
  }

  getSingleFraction(
    fractionId: number
  ): Observable<OperationDataResult<FractionPnModel>> {
    return this.apiBaseService.get(
      TrashInspectionPnFractionMethods.Fractions + '/' + fractionId
    );
  }

  getSingleFractionByMonth(
    fractionId: number,
    year: number
  ): Observable<OperationDataResult<StatByMonthPnModel>> {
    return this.apiBaseService.get(
      TrashInspectionPnFractionMethods.Fractions + '/' + fractionId + '/' + year
    );
  }

  updateFraction(model: FractionPnUpdateModel): Observable<OperationResult> {
    return this.apiBaseService.put(
      TrashInspectionPnFractionMethods.Fractions,
      model
    );
  }

  createFraction(model: FractionPnModel): Observable<OperationResult> {
    return this.apiBaseService.post(
      TrashInspectionPnFractionMethods.Fractions,
      model
    );
  }

  deleteFraction(fractionId: number): Observable<OperationResult> {
    return this.apiBaseService.delete(
      TrashInspectionPnFractionMethods.Fractions + '/' + fractionId
    );
  }
  importFraction(model: FractionPnImportModel): Observable<OperationResult> {
    return this.apiBaseService.post(
      TrashInspectionPnFractionMethods.FractionsImport,
      model
    );
  }

  getAllFractionsStatsByYear(
    model: FractionPnYearRequestModel
  ): Observable<OperationDataResult<Paged<FractionPnStatsByYearModel>>> {
    return this.apiBaseService.post(
      TrashInspectionPnFractionMethods.FractionsStatsByYear,
      model
    );
  }
}
