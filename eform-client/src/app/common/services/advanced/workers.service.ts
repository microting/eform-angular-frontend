import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OperationDataResult,
  OperationResult,
  WorkerCreateModel,
  WorkerDto,
  WorkerModel,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

const WorkersMethods = {
  GetAll: '/api/workers/index',
  GetSingle: '/api/workers/edit',
  UpdateSingle: '/api/workers/update',
  CreateSingle: '/api/workers/create',
  DeleteSingle: '/api/workers/delete',
};

@Injectable()
export class WorkersService {
  private apiBaseService = inject(ApiBaseService);


  getAllWorkers(): Observable<OperationDataResult<Array<WorkerDto>>> {
    return this.apiBaseService.get<Array<WorkerDto>>(WorkersMethods.GetAll);
  }

  getSingleWorker(id: number): Observable<OperationDataResult<WorkerDto>> {
    return this.apiBaseService.get<WorkerDto>(
      WorkersMethods.GetSingle + '/' + id
    );
  }

  updateSingleWorker(model: WorkerModel): Observable<OperationResult> {
    return this.apiBaseService.post<WorkerModel>(
      WorkersMethods.UpdateSingle,
      model
    );
  }

  deleteSingleWorker(id: number): Observable<OperationResult> {
    return this.apiBaseService.get(WorkersMethods.DeleteSingle + '/' + id);
  }

  createWorker(model: WorkerCreateModel): Observable<OperationResult> {
    return this.apiBaseService.post<WorkerCreateModel>(
      WorkersMethods.CreateSingle,
      model
    );
  }
}
