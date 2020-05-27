import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {
  AdvEntitySearchableGroupEditModel,
  AdvEntitySearchableGroupListModel,
  AdvEntitySearchableGroupModel, CommonDictionaryTextModel,
  OperationDataResult, OperationResult
} from 'src/app/common/models';
import {AdvEntitySearchableGroupListRequestModel} from 'src/app/common/models/advanced';
import {BaseService} from 'src/app/common/services/base.service';

const AdvSearchableEntityMethods = {
  GetAll: '/api/searchable-groups',
  GetSingle: '/api/searchable-groups/get',
  DeleteSingle: '/api/searchable-groups/delete',
  CreateSingle: '/api/searchable-groups/create',
  UpdateSingle: '/api/searchable-groups/update',
  ImportGroup: '/api/searchable-groups/import'
};


@Injectable()
export class EntitySearchService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getEntitySearchableGroupList(model: AdvEntitySearchableGroupListRequestModel):
    Observable<OperationDataResult<AdvEntitySearchableGroupListModel>> {
    return this.post<AdvEntitySearchableGroupListModel>(AdvSearchableEntityMethods.GetAll, model);
  }

  getEntitySearchableGroup(id: number): Observable<OperationDataResult<AdvEntitySearchableGroupModel>> {
    return this.get<AdvEntitySearchableGroupModel>(AdvSearchableEntityMethods.GetSingle + '/' + id);
  }

  updateEntitySearchableGroup(model: AdvEntitySearchableGroupEditModel): Observable<OperationResult> {
    return this.post<AdvEntitySearchableGroupEditModel>(AdvSearchableEntityMethods.UpdateSingle, model);
  }

  deleteEntitySearchableGroup(groupUid: string): Observable<OperationResult> {
    return this.get(AdvSearchableEntityMethods.DeleteSingle + '/' + groupUid);
  }

  createEntitySearchableGroup(model: AdvEntitySearchableGroupEditModel): Observable<OperationResult> {
    return this.post<AdvEntitySearchableGroupEditModel>(AdvSearchableEntityMethods.CreateSingle, model);
  }

  getEntitySearchableGroupDictionary(entityGroupUid: string, searchString: string):
    Observable<OperationDataResult<Array<CommonDictionaryTextModel>>> {
    return this.get<Array<CommonDictionaryTextModel>>(AdvSearchableEntityMethods.GetAll + '/dict/'
      + entityGroupUid + '?searchString=' + searchString);
  }
}

