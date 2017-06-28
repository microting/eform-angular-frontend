import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {BaseService} from 'app/services/base.service';
import {OperationDataResult, OperationResult} from 'app/modules/helpers/operation.models';
import {AdvEntityGroupListModel} from 'app/models';
import {AdvSearchableEntityMethods} from 'app/modules/helpers/app.constants';
import {AdvEntityGroupEditModel, AdvEntityGroupListRequestModel, AdvEntityGroupModel} from 'app/models/advanced';

@Injectable()
export class EntitySearchService extends BaseService {
  private headers: Headers;

  constructor(private _http: Http) {
    super(_http);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  public getEntityGroupList = (model: AdvEntityGroupListRequestModel): Observable<OperationDataResult<AdvEntityGroupListModel>> => {
    return this.postModelOperationDataResult<AdvEntityGroupListRequestModel, AdvEntityGroupListModel>(AdvSearchableEntityMethods.GetAll, model);
  }

  public getEntityGroup = (id: string): Observable<OperationDataResult<AdvEntityGroupModel>> => {
    return this.getWithOperationDataResult<AdvEntityGroupModel>(AdvSearchableEntityMethods.GetSingle + '/' + id);
  }

  public updateEntityGroup = (model: AdvEntityGroupEditModel): Observable<OperationResult> => {
    return this.postModelOperationResult<AdvEntityGroupEditModel>(AdvSearchableEntityMethods.UpdateSingle, model);
  }

  public deleteEntityGroup = (groupUid: string): Observable<OperationResult> => {
    return this.getWithOperationResult(AdvSearchableEntityMethods.DeleteSingle + '/' + groupUid);
  }

  public createEntityGroup = (model: AdvEntityGroupEditModel): Observable<OperationResult> => {
    return this.postModelOperationResult<AdvEntityGroupEditModel>(AdvSearchableEntityMethods.CreateSingle, model);
  }

}

