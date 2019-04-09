import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from 'src/app/common/models';
import {BaseService} from 'src/app/common/services/base.service';
import {FolderCreateModel} from '../../models/advanced/folder-create.model';
import {FolderDto} from '../../models/dto/folder.dto';
import {FolderModel} from '../../models/advanced/folder.model';

const FoldersMethods = {
  GetAll: '/api/folders/index',
  GetSingle: '/api/folders/edit',
  UpdateSingle: '/api/folders/update',
  CreateSingle: '/api/folders/create',
  DeleteSingle: '/api/folders/delete'
};

@Injectable()
export class FoldersService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllFolders(): Observable<OperationDataResult<Array<FolderDto>>> {
    return this.get<Array<FolderDto>>(FoldersMethods.GetAll);
  }

  getSingleFolder(id: number): Observable<OperationDataResult<FolderDto>> {
    return this.get<FolderDto>(FoldersMethods.GetSingle + '/' + id);
  }

  updateSingleFolder(model: FolderModel): Observable<OperationResult> {
    return this.post<FolderModel>(FoldersMethods.UpdateSingle, model);
  }

  deleteSingleFolder(id: number): Observable<OperationResult> {
    return this.get(FoldersMethods.DeleteSingle + '/' + id);
  }

  createFolder(model: FolderCreateModel): Observable<OperationResult> {
    return this.post<FolderCreateModel>(FoldersMethods.CreateSingle, model);
  }

}
