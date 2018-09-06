import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult, WorkerCreateModel, WorkerDto, WorkerModel} from 'src/app/common/models';
import {BaseService} from 'src/app/common/services/base.service';

const WorkersMethods = {
  GetAll: '/api/workers/index',
  GetSingle: '/api/workers/edit',
  UpdateSingle: '/api/workers/update',
  CreateSingle: '/api/workers/create',
  DeleteSingle: '/api/workers/delete'
};

@Injectable()
export class WorkersService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllWorkers(): Observable<OperationDataResult<Array<WorkerDto>>> {
    return this.get<Array<WorkerDto>>(WorkersMethods.GetAll);
  }

  getSingleWorker(id: number): Observable<OperationDataResult<WorkerDto>> {
    return this.get<WorkerDto>(WorkersMethods.GetSingle + '/' + id);
  }

  updateSingleWorker(model: WorkerModel): Observable<OperationResult> {
    return this.post<WorkerModel>(WorkersMethods.UpdateSingle, model);
  }

  deleteSingleWorker(id: number): Observable<OperationResult> {
    return this.get(WorkersMethods.DeleteSingle + '/' + id);
  }

  createWorker(model: WorkerCreateModel): Observable<OperationResult> {
    return this.post<WorkerCreateModel>(WorkersMethods.CreateSingle, model);
  }

}
