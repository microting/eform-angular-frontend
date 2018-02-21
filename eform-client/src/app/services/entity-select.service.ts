import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {Router} from '@angular/router';
import {AdvEntitySelectableGroupListModel} from 'app/models';
import {AdvEntitySelectableGroupEditModel, AdvEntitySelectableGroupListRequestModel, AdvEntitySelectableGroupModel} from 'app/models/advanced';
import {AdvSelectableEntityMethods} from 'app/modules/helpers/app.constants';
import {OperationDataResult, OperationResult} from 'app/modules/helpers/operation.models';
import {BaseService} from 'app/services/base.service';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {CommonDictionaryModel, CommonDictionaryTextModel} from '../models/common';

@Injectable()
export class EntitySelectService extends BaseService {
  private headers: Headers;

  constructor(private _http: Http, router: Router) {
    super(_http, router);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  public getEntitySelectableGroupList = (model: AdvEntitySelectableGroupListRequestModel): Observable<OperationDataResult<AdvEntitySelectableGroupListModel>> => {
    return this.postModelOperationDataResult<AdvEntitySelectableGroupListRequestModel, AdvEntitySelectableGroupListModel>(AdvSelectableEntityMethods.GetAll, model);
  }

  public getEntitySelectableGroup = (id: string): Observable<OperationDataResult<AdvEntitySelectableGroupModel>> => {
    return this.getWithOperationDataResult<AdvEntitySelectableGroupModel>(AdvSelectableEntityMethods.GetSingle + '/' + id);
  }

  public updateEntitySelectableGroup = (model: AdvEntitySelectableGroupEditModel): Observable<OperationResult> => {
    return this.postModelOperationResult<AdvEntitySelectableGroupEditModel>(AdvSelectableEntityMethods.UpdateSingle, model);
  }

  public deleteEntitySelectableGroup = (groupUid: string): Observable<OperationResult> => {
    return this.getWithOperationResult(AdvSelectableEntityMethods.DeleteSingle + '/' + groupUid);
  }

  public createEntitySelectableGroup = (model: AdvEntitySelectableGroupEditModel): Observable<OperationResult> => {
    return this.postModelOperationResult<AdvEntitySelectableGroupEditModel>(AdvSelectableEntityMethods.CreateSingle, model);
  }

  public getEntitySelectableGroupDictionary = (entityGroupUid: string):
    Observable<OperationDataResult<Array<CommonDictionaryTextModel>>> => {
    return this.getWithOperationDataResult<Array<CommonDictionaryTextModel>>(AdvSelectableEntityMethods.GetAll + '/dict/'
      + entityGroupUid);
  }
}

