import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  FolderModel,
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models';
import { BaseService } from 'src/app/common/services/base.service';
import { FolderCreateModel } from '../../models/advanced/folders/folder-create.model';
import { FolderDto } from '../../models/dto/folder.dto';
import { FolderUpdateModel } from '../../models/advanced/folders/folder-update-model';

const FoldersMethods = {
  Folders: '/api/folders',
  FoldersList: '/api/folders/list',
};

@Injectable()
export class FoldersService extends BaseService {
  constructor(
    private _http: HttpClient,
    router: Router,
    toastrService: ToastrService
  ) {
    super(_http, router, toastrService);
  }

  getAllFolders(): Observable<OperationDataResult<FolderDto[]>> {
    return this.get(FoldersMethods.Folders);
  }

  getAllFoldersList(): Observable<OperationDataResult<FolderDto[]>> {
    return this.get(FoldersMethods.FoldersList);
  }

  getSingleFolder(id: number): Observable<OperationDataResult<FolderModel>> {
    return this.get(FoldersMethods.Folders + '/' + id);
  }

  updateSingleFolder(model: FolderUpdateModel): Observable<OperationResult> {
    return this.put(FoldersMethods.Folders, model);
  }

  deleteSingleFolder(id: number): Observable<OperationResult> {
    return this.delete(FoldersMethods.Folders + '/' + id);
  }

  createFolder(model: FolderCreateModel): Observable<OperationResult> {
    return this.post(FoldersMethods.Folders, model);
  }
}
