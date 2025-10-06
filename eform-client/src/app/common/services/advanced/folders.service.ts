import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  FolderModel,
  OperationDataResult,
  OperationResult,
  FolderCreateModel,
  FolderDto,
  FolderUpdateModel,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';
import * as R from 'ramda';

const FoldersMethods = {
  Folders: '/api/folders',
  FoldersList: '/api/folders/list',
  FoldersCommonDictionaryModel: '/api/folders/common-dictionary-model',
};

@Injectable()
export class FoldersService {
  private apiBaseService = inject(ApiBaseService);


  getAllFolders(): Observable<OperationDataResult<FolderDto[]>> {
    return this.apiBaseService.get(FoldersMethods.Folders);
  }

  getAllFoldersList(): Observable<OperationDataResult<FolderDto[]>> {
    return this.apiBaseService.get(FoldersMethods.FoldersList);
  }

  getSingleFolder(id: number): Observable<OperationDataResult<FolderModel>> {
    return this.apiBaseService.get(FoldersMethods.Folders + '/' + id);
  }

  updateSingleFolder(model: FolderUpdateModel): Observable<OperationResult> {
    return this.apiBaseService.put(FoldersMethods.Folders, model);
  }

  deleteSingleFolder(id: number): Observable<OperationResult> {
    return this.apiBaseService.delete(FoldersMethods.Folders + '/' + id);
  }

  createFolder(model: FolderCreateModel): Observable<OperationResult> {
    return this.apiBaseService.post(FoldersMethods.Folders, model);
  }

  getFoldersAsCommonDictionaryModel(model: {
    ids?: number[],
    fullNames?: boolean,
    getOnlyChildFolders?: boolean
  }): Observable<OperationResult> {
    return this.apiBaseService.get(FoldersMethods.FoldersCommonDictionaryModel, {
      filterList: (!R.isNil(model.ids)) ? model.ids : [],
      fullNames: (!R.isNil(model.fullNames)) ? model.fullNames : true,
      getOnlyChildFolders: (!R.isNil(model.getOnlyChildFolders)) ? model.getOnlyChildFolders : true,
    });
  }
}
