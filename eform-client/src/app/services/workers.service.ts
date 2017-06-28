import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {OperationDataResult, OperationResult, WorkersMethods} from '../modules/helpers/helpers.module';
import {BaseService} from './base.service';
import {WorkerDto} from '../models/dto/worker.dto';
import {WorkerModel} from '../models/advanced/worker.model';

@Injectable()
export class WorkersService extends BaseService {
  private headers: Headers;

  constructor(private _http: Http) {
    super(_http);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  public getAllWorkers = (): Observable<OperationDataResult<Array<WorkerDto>>> => {
    return this.getWithOperationDataResult<Array<WorkerDto>>(WorkersMethods.GetAll);
  }

  public getSingleWorker = (id: number): Observable<OperationDataResult<WorkerDto>> => {
    return this.getWithOperationDataResult<WorkerDto>(WorkersMethods.GetSingle + '/' + id);
  }

  public updateSingleWorker = (model: WorkerModel): Observable<OperationResult> => {
    return this.postModelOperationResult<WorkerModel>(WorkersMethods.UpdateSingle, model);
  }

  public deleteSingleWorker = (id: number): Observable<OperationResult> => {
    return this.getWithOperationResult(WorkersMethods.DeleteSingle + '/' + id);
  }
}
