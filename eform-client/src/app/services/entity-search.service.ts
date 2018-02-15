import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {Router} from '@angular/router';
import {AdvEntitySearchableGroupListModel} from 'app/models';
import {AdvEntitySearchableGroupEditModel, AdvEntitySearchableGroupListRequestModel, AdvEntitySearchableGroupModel} from 'app/models/advanced';
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

  public getEntitySearchableGroupList = (model: AdvEntitySearchableGroupListRequestModel): Observable<OperationDataResult<AdvEntitySearchableGroupListModel>> => {
    return this.postModelOperationDataResult<AdvEntitySearchableGroupListRequestModel, AdvEntitySearchableGroupListModel>(AdvSearchableEntityMethods.GetAll, model);
  }

  public getEntitySearchableGroup = (id: string): Observable<OperationDataResult<AdvEntitySearchableGroupModel>> => {
    return this.getWithOperationDataResult<AdvEntitySearchableGroupModel>(AdvSearchableEntityMethods.GetSingle + '/' + id);
  }

  public updateEntitySearchableGroup = (model: AdvEntitySearchableGroupEditModel): Observable<OperationResult> => {
    return this.postModelOperationResult<AdvEntitySearchableGroupEditModel>(AdvSearchableEntityMethods.UpdateSingle, model);
  }

  public deleteEntitySearchableGroup = (groupUid: string): Observable<OperationResult> => {
    return this.getWithOperationResult(AdvSearchableEntityMethods.DeleteSingle + '/' + groupUid);
  }

  public createEntitySearchableGroup = (model: AdvEntitySearchableGroupEditModel): Observable<OperationResult> => {
    return this.postModelOperationResult<AdvEntitySearchableGroupEditModel>(AdvSearchableEntityMethods.CreateSingle, model);
  }

  public getEntitySearchableGroupDictionary = (entityGroupUid: string, searchString: string):
    Observable<OperationDataResult<Array<CommonDictionaryTextModel>>> => {
    return this.getWithOperationDataResult<Array<CommonDictionaryTextModel>>(AdvSearchableEntityMethods.GetAll + '/dict/'
      + entityGroupUid + '?searchString=' + searchString);
  }
}

