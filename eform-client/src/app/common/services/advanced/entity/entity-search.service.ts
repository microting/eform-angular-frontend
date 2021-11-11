import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AdvEntitySearchableGroupEditModel,
  AdvEntitySearchableGroupListRequestModel,
  AdvEntitySearchableGroupModel,
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
  constructor(private apiBaseService: ApiBaseService) {}

  getEntitySearchableGroupList(
    model: AdvEntitySearchableGroupListRequestModel
  ): Observable<OperationDataResult<Paged<AdvEntitySearchableGroupModel>>> {
    return this.apiBaseService.post<Paged<AdvEntitySearchableGroupModel>>(
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
