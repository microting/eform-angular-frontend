import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {Router} from '@angular/router';
import {AdvEntityGroupListModel} from 'app/models';
import {AdvEntityGroupEditModel, AdvEntityGroupListRequestModel, AdvEntityGroupModel} from 'app/models/advanced';
import {AdvSearchableEntityMethods} from 'app/modules/helpers/app.constants';
import {OperationDataResult, OperationResult} from 'app/modules/helpers/operation.models';
import {BaseService} from 'app/services/base.service';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {CommonDictionaryModel, CommonDictionaryTextModel} from '../models/common';

@Injectable()
export class EntitySearchService extends BaseService {
  private headers: Headers;

  constructor(private _http: Http, router: Router) {
    super(_http, router);
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

  public getEntityGroupDictionary = (entityGroupUid: string, searchString: string):
    Observable<OperationDataResult<Array<CommonDictionaryTextModel>>> => {
    return this.getWithOperationDataResult<Array<CommonDictionaryTextModel>>(AdvSearchableEntityMethods.GetAll + '/dict/'
      + entityGroupUid + '?searchString=' + searchString);
  }
}

