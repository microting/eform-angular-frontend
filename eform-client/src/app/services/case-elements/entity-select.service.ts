import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

import {AdvEntitySelectableGroupEditModel, AdvEntitySelectableGroupListRequestModel,
  AdvEntitySelectableGroupModel, AdvEntitySelectableGroupListModel,
  CommonDictionaryModel, CommonDictionaryTextModel} from 'app/models';
import {AdvSelectableEntityMethods} from 'app/modules/helpers/app.constants';
import {OperationDataResult, OperationResult} from 'app/modules/helpers/operation.models';
import {BaseService} from 'app/services/base.service';

@Injectable()
export class EntitySelectService extends BaseService {
  private headers: Headers;

  constructor(private _http: Http, router: Router) {
    super(_http, router);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  getEntitySelectableGroupList(model: AdvEntitySelectableGroupListRequestModel): Observable<OperationDataResult<AdvEntitySelectableGroupListModel>> {
    return this.postModelOperationDataResult<AdvEntitySelectableGroupListRequestModel, AdvEntitySelectableGroupListModel>(AdvSelectableEntityMethods.GetAll, model);
  }

  getEntitySelectableGroup(id: string): Observable<OperationDataResult<AdvEntitySelectableGroupModel>> {
    return this.getWithOperationDataResult<AdvEntitySelectableGroupModel>(AdvSelectableEntityMethods.GetSingle + '/' + id);
  }

  updateEntitySelectableGroup(model: AdvEntitySelectableGroupEditModel): Observable<OperationResult> {
    return this.postModelOperationResult<AdvEntitySelectableGroupEditModel>(AdvSelectableEntityMethods.UpdateSingle, model);
  }

  deleteEntitySelectableGroup(groupUid: string): Observable<OperationResult> {
    return this.getWithOperationResult(AdvSelectableEntityMethods.DeleteSingle + '/' + groupUid);
  }

  createEntitySelectableGroup(model: AdvEntitySelectableGroupEditModel): Observable<OperationResult> {
    return this.postModelOperationResult<AdvEntitySelectableGroupEditModel>(AdvSelectableEntityMethods.CreateSingle, model);
  }

  getEntitySelectableGroupDictionary(entityGroupUid: string):
    Observable<OperationDataResult<Array<CommonDictionaryTextModel>>> {
    return this.getWithOperationDataResult<Array<CommonDictionaryTextModel>>(AdvSelectableEntityMethods.GetAll + '/dict/'
      + entityGroupUid);
  }
}

