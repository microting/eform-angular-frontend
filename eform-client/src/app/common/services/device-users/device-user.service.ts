import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult, SimpleSiteModel} from 'src/app/common/models';
import {SiteDto} from 'src/app/common/models/dto';
import {BaseService} from '../base.service';

const SimpleSitesMethods = {
  GetAll: '/api/simplesites/index',
  GetSingle: '/api/simplesites/edit',
  UpdateSingle: '/api/simplesites/update',
  DeleteSingle: '/api/simplesites/delete',
  CreateSingle: '/api/simplesites/create'
};

@Injectable()
export class DeviceUserService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllSimpleSites(): Observable<OperationDataResult<Array<SiteDto>>> {
    return this.get<Array<SiteDto>>(SimpleSitesMethods.GetAll);
  }

  getSingleSimpleSite(id: number): Observable<OperationDataResult<SiteDto>> {
    return this.get<SiteDto>(SimpleSitesMethods.GetSingle + '/' + id);
  }

  updateSingleSimpleSite(model: SimpleSiteModel): Observable<OperationResult> {
    return this.post<SimpleSiteModel>(SimpleSitesMethods.UpdateSingle, model);
  }

  deleteSingleSimpleSite(id: number): Observable<OperationResult> {
    return this.get(SimpleSitesMethods.DeleteSingle + '/' + id);
  }

  createSingleSimpleSite(model: SimpleSiteModel): Observable<OperationResult> {
    return this.post<SimpleSiteModel>(SimpleSitesMethods.CreateSingle, model);
  }
}

