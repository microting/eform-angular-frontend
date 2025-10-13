import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  EntityGroupEditModel,
  AdvEntitySearchableGroupListRequestModel,
  EntityGroupModel,
  CommonDictionaryModel,
  CommonDictionaryTextModel,
  OperationDataResult,
  OperationResult,
  Paged,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

const AdvSearchableEntityMethods = {
  GetAll: '/api/searchable-groups',
  GetSingle: '/api/searchable-groups/get',
  DeleteSingle: '/api/searchable-groups/delete',
  CreateSingle: '/api/searchable-groups/create',
  UpdateSingle: '/api/searchable-groups/update',
  ImportGroup: '/api/searchable-groups/import',
  GetGroupsDictionary: '/api/searchable-groups/dict',
};

@Injectable()
export class EntitySearchService {
  private apiBaseService = inject(ApiBaseService);


  getEntitySearchableGroupList(
    model: AdvEntitySearchableGroupListRequestModel
  ): Observable<OperationDataResult<Paged<EntityGroupModel>>> {
    return this.apiBaseService.post<Paged<EntityGroupModel>>(
      AdvSearchableEntityMethods.GetAll,
      model
    );
  }

  getEntitySearchableGroup(
    id: number
  ): Observable<OperationDataResult<EntityGroupModel>> {
    return this.apiBaseService.get<EntityGroupModel>(
      AdvSearchableEntityMethods.GetSingle + '/' + id
    );
  }

  updateEntitySearchableGroup(
    model: EntityGroupEditModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post<EntityGroupEditModel>(
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
    model: EntityGroupEditModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post<EntityGroupEditModel>(
      AdvSearchableEntityMethods.CreateSingle,
      model
    );
  }

  getEntitySearchableGroupDictionary(
    entityGroupUid: string,
    searchString: string
  ): Observable<OperationDataResult<Array<CommonDictionaryTextModel>>> {
    return this.apiBaseService.get<Array<CommonDictionaryTextModel>>(
      `${AdvSearchableEntityMethods.GetGroupsDictionary}/${entityGroupUid}?searchString=${searchString}`
    );
  }

  getEntitySearchableGroupsInDictionary(
    searchString: string
  ): Observable<OperationDataResult<Array<CommonDictionaryModel>>> {
    return this.apiBaseService.get(
      AdvSearchableEntityMethods.GetGroupsDictionary,
      { searchString: searchString }
    );
  }
}
