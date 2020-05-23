import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {
  AdvEntitySelectableGroupEditModel,
  AdvEntitySelectableGroupListModel,
  AdvEntitySelectableGroupModel, CommonDictionaryTextModel,
  OperationDataResult, OperationResult
} from 'src/app/common/models';
import {AdvEntitySelectableGroupListRequestModel} from 'src/app/common/models/advanced';
import {BaseService} from 'src/app/common/services/base.service';

const AdvSelectableEntityMethods = {
  GetAll: '/api/selectable-groups',
  GetSingle: '/api/selectable-groups/get',
  DeleteSingle: '/api/selectable-groups/delete',
  CreateSingle: '/api/selectable-groups/create',
  UpdateSingle: '/api/selectable-groups/update',
  ImportGroup: '/api/selectable-groups/import'
};

@Injectable()
export class EntitySelectService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getEntitySelectableGroupList(model: AdvEntitySelectableGroupListRequestModel):
    Observable<OperationDataResult<AdvEntitySelectableGroupListModel>> {
    return this.post<AdvEntitySelectableGroupListModel>(AdvSelectableEntityMethods.GetAll, model);
  }

  getEntitySelectableGroup(id: number): Observable<OperationDataResult<AdvEntitySelectableGroupModel>> {
    return this.get<AdvEntitySelectableGroupModel>(AdvSelectableEntityMethods.GetSingle + '/' + id);
  }

  updateEntitySelectableGroup(model: AdvEntitySelectableGroupEditModel): Observable<OperationResult> {
    return this.post<AdvEntitySelectableGroupEditModel>(AdvSelectableEntityMethods.UpdateSingle, model);
  }

  deleteEntitySelectableGroup(groupUid: string): Observable<OperationResult> {
    return this.get(AdvSelectableEntityMethods.DeleteSingle + '/' + groupUid);
  }

  createEntitySelectableGroup(model: AdvEntitySelectableGroupEditModel): Observable<OperationResult> {
    return this.post<AdvEntitySelectableGroupEditModel>(AdvSelectableEntityMethods.CreateSingle, model);
  }

  getEntitySelectableGroupDictionary(entityGroupUid: string):
    Observable<OperationDataResult<Array<CommonDictionaryTextModel>>> {
    return this.get<Array<CommonDictionaryTextModel>>(AdvSelectableEntityMethods.GetAll + '/dict/'
      + entityGroupUid);
  }
}

