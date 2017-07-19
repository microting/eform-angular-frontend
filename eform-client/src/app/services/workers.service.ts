import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {OperationDataResult, OperationResult, WorkersMethods} from '../modules/helpers/helpers.module';
import {BaseService} from './base.service';
import {Router} from '@angular/router';
import {WorkerDto} from 'app/models/dto';
import {WorkerModel} from 'app/models/advanced';

@Injectable()
export class WorkersService extends BaseService {
  private headers: Headers;

  constructor(private _http: Http, router: Router) {
    super(_http, router);
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
