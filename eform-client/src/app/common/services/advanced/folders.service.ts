import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from 'src/app/common/models';
import {BaseService} from 'src/app/common/services/base.service';
import {FolderCreateModel} from '../../models/advanced/folder-create.model';
import {FolderDto} from '../../models/dto/folder.dto';
import {FolderUpdateModel} from '../../models/advanced/folderUpdateModel';

const FoldersMethods = {
  Folders: '/api/folders',
  FoldersList: '/api/folders/list',
};

@Injectable()
export class FoldersService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllFolders(): Observable<OperationDataResult<Array<FolderDto>>> {
    return this.get<Array<FolderDto>>(FoldersMethods.Folders);
  }

  getAllFoldersList(): Observable<OperationDataResult<Array<FolderDto>>> {
    return this.get<Array<FolderDto>>(FoldersMethods.FoldersList);
  }

  getSingleFolder(id: number): Observable<OperationDataResult<FolderDto>> {
    return this.get<FolderDto>(FoldersMethods.Folders + '/' + id);
  }

  updateSingleFolder(model: FolderUpdateModel): Observable<OperationResult> {
    return this.put<FolderUpdateModel>(FoldersMethods.Folders, model);
  }

  deleteSingleFolder(id: number): Observable<OperationResult> {
    return this.delete(FoldersMethods.Folders + '/' + id);
  }

  createFolder(model: FolderCreateModel): Observable<OperationResult> {
    return this.post<FolderCreateModel>(FoldersMethods.Folders, model);
  }

}
