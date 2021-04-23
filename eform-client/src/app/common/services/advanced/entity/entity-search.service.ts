import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AdvEntitySearchableGroupEditModel,
  AdvEntitySearchableGroupListModel,
  AdvEntitySearchableGroupListRequestModel,
  AdvEntitySearchableGroupModel,
  CommonDictionaryTextModel,
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

const AdvSearchableEntityMethods = {
  GetAll: '/api/searchable-groups',
  GetSingle: '/api/searchable-groups/get',
  DeleteSingle: '/api/searchable-groups/delete',
  CreateSingle: '/api/searchable-groups/create',
  UpdateSingle: '/api/searchable-groups/update',
  ImportGroup: '/api/searchable-groups/import',
};

@Injectable()
export class EntitySearchService {
  constructor(private apiBaseService: ApiBaseService) {}

  getEntitySearchableGroupList(
    model: AdvEntitySearchableGroupListRequestModel
  ): Observable<OperationDataResult<AdvEntitySearchableGroupListModel>> {
    return this.apiBaseService.post<AdvEntitySearchableGroupListModel>(
      AdvSearchableEntityMethods.GetAll,
      model
    );
  }

  getEntitySearchableGroup(
    id: number
  ): Observable<OperationDataResult<AdvEntitySearchableGroupModel>> {
    return this.apiBaseService.get<AdvEntitySearchableGroupModel>(
      AdvSearchableEntityMethods.GetSingle + '/' + id
    );
  }

  updateEntitySearchableGroup(
    model: AdvEntitySearchableGroupEditModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post<AdvEntitySearchableGroupEditModel>(
      AdvSearchableEntityMethods.UpdateSingle,
      model
    );
  }

  deleteEntitySearchableGroup(groupUid: string): Observable<OperationResult> {
    return this.apiBaseService.get(
      AdvSearchableEntityMethods.DeleteSingle + '/' + groupUid
    );
  }

  createEntitySearchableGroup(
    model: AdvEntitySearchableGroupEditModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post<AdvEntitySearchableGroupEditModel>(
      AdvSearchableEntityMethods.CreateSingle,
      model
    );
  }

  getEntitySearchableGroupDictionary(
    entityGroupUid: string,
    searchString: string
  ): Observable<OperationDataResult<Array<CommonDictionaryTextModel>>> {
    return this.apiBaseService.get<Array<CommonDictionaryTextModel>>(
      AdvSearchableEntityMethods.GetAll +
        '/dict/' +
        entityGroupUid +
        '?searchString=' +
        searchString
    );
  }
}
