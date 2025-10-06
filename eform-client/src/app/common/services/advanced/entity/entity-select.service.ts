import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  EntityGroupModel,
  CommonDictionaryModel,
  CommonDictionaryTextModel, EntityGroupEditModel,
  OperationDataResult,
  OperationResult,
  Paged,
} from 'src/app/common/models';
import { AdvEntitySelectableGroupListRequestModel } from 'src/app/common/models/advanced';
import { ApiBaseService } from 'src/app/common/services';

const AdvSelectableEntityMethods = {
  GetAll: '/api/selectable-groups',
  GetSingle: '/api/selectable-groups/get',
  DeleteSingle: '/api/selectable-groups/delete',
  CreateSingle: '/api/selectable-groups/create',
  UpdateSingle: '/api/selectable-groups/update',
  ImportGroup: '/api/selectable-groups/import',
  GetGroupsDictionary: '/api/selectable-groups/dict',
};

@Injectable()
export class EntitySelectService {
  private apiBaseService = inject(ApiBaseService);


  getEntitySelectableGroupList(
    model: AdvEntitySelectableGroupListRequestModel
  ): Observable<OperationDataResult<Paged<EntityGroupModel>>> {
    return this.apiBaseService.post<Paged<EntityGroupModel>>(
      AdvSelectableEntityMethods.GetAll,
      model
    );
  }

  getEntitySelectableGroup(
    id: number
  ): Observable<OperationDataResult<EntityGroupModel>> {
    return this.apiBaseService.get<EntityGroupModel>(
      AdvSelectableEntityMethods.GetSingle + '/' + id
    );
  }

  updateEntitySelectableGroup(
    model: EntityGroupEditModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post<EntityGroupEditModel>(
      AdvSelectableEntityMethods.UpdateSingle,
      model
    );
  }

  deleteEntitySelectableGroup(groupUid: string): Observable<OperationResult> {
    return this.apiBaseService.get(
      AdvSelectableEntityMethods.DeleteSingle + '/' + groupUid
    );
  }

  createEntitySelectableGroup(
    model: EntityGroupEditModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post<EntityGroupEditModel>(
      AdvSelectableEntityMethods.CreateSingle,
      model
    );
  }

  getEntitySelectableGroupDictionary(
    entityGroupUid: string
  ): Observable<OperationDataResult<Array<CommonDictionaryTextModel>>> {
    return this.apiBaseService.get<Array<CommonDictionaryTextModel>>(
      `${AdvSelectableEntityMethods.GetGroupsDictionary}/${entityGroupUid}`
    );
  }

  getEntitySelectableGroupsInDictionary(
    searchString: string
  ): Observable<OperationDataResult<Array<CommonDictionaryModel>>> {
    return this.apiBaseService.get(
      AdvSelectableEntityMethods.GetGroupsDictionary,
      { searchString: searchString }
    );
  }
}
