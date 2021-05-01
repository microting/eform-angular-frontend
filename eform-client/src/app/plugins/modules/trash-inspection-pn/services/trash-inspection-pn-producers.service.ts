import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models/operation.models';
import {
  ProducerPnImportModel,
  ProducerPnModel,
  ProducerPnRequestModel,
  ProducerPnStatsByYearModel,
  ProducerPnUpdateModel,
  ProducerPnYearRequestModel,
  ProducersPnModel,
  StatByMonthPnModel,
} from '../models';
import { Paged } from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

export let TrashInspectionPnProducerMethods = {
  Producers: 'api/trash-inspection-pn/producers',
  ProducersStatsByYear: 'api/trash-inspection-pn/producers/stats-by-year',
};
@Injectable({
  providedIn: 'root',
})
export class TrashInspectionPnProducersService {
  constructor(private apiBaseService: ApiBaseService) {}
  getAllProducers(
    model: ProducerPnRequestModel
  ): Observable<OperationDataResult<ProducersPnModel>> {
    return this.apiBaseService.get(
      TrashInspectionPnProducerMethods.Producers,
      model
    );
  }

  getSingleProducer(
    producerId: number
  ): Observable<OperationDataResult<ProducerPnModel>> {
    return this.apiBaseService.get(
      TrashInspectionPnProducerMethods.Producers + '/' + producerId
    );
  }

  getSingleProducerByMonth(
    producerId: number,
    year: number
  ): Observable<OperationDataResult<StatByMonthPnModel>> {
    return this.apiBaseService.get(
      TrashInspectionPnProducerMethods.Producers + '/' + producerId + '/' + year
    );
  }

  updateProducer(model: ProducerPnUpdateModel): Observable<OperationResult> {
    return this.apiBaseService.put(
      TrashInspectionPnProducerMethods.Producers,
      model
    );
  }

  createProducer(model: ProducerPnModel): Observable<OperationResult> {
    return this.apiBaseService.post(
      TrashInspectionPnProducerMethods.Producers,
      model
    );
  }

  deleteProducer(producerId: number): Observable<OperationResult> {
    return this.apiBaseService.delete(
      TrashInspectionPnProducerMethods.Producers + '/' + producerId
    );
  }
  importProducer(model: ProducerPnImportModel): Observable<OperationResult> {
    return this.apiBaseService.post(
      TrashInspectionPnProducerMethods.Producers + '/import',
      model
    );
  }

  getAllProducersStatsByYear(
    model: ProducerPnYearRequestModel
  ): Observable<OperationDataResult<Paged<ProducerPnStatsByYearModel>>> {
    return this.apiBaseService.post(
      TrashInspectionPnProducerMethods.ProducersStatsByYear,
      model
    );
  }
}
