import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CommonDictionaryModel, OperationDataResult, OperationResult, SiteNameDto, SiteNameModel} from 'src/app/common/models';
import {BaseService} from '../../base.service';

const SitesMethods = {
  GetAll: '/api/sites/index',
  GetAllDictionary: '/api/sites/dictionary',
  GetAllSitesForPairing: '/api/sites/pairing',
  GetSingle: '/api/sites/edit',
  UpdateSingle: '/api/sites/update',
  DeleteSingle: '/api/sites/delete'
};

@Injectable()
export class SitesService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAllSites(): Observable<OperationDataResult<Array<SiteNameDto>>> {
    return this.get<Array<SiteNameDto>>(SitesMethods.GetAll);
  }

  getAllSitesDictionary(): Observable<OperationDataResult<Array<CommonDictionaryModel>>> {
    return this.get<Array<CommonDictionaryModel>>(SitesMethods.GetAllDictionary);
  }

  getAllSitesForPairing(): Observable<OperationDataResult<Array<SiteNameDto>>> {
    return this.get<Array<SiteNameDto>>(SitesMethods.GetAllSitesForPairing);
  }

  getSingleSite(id: number): Observable<OperationDataResult<SiteNameDto>> {
    return this.get<SiteNameDto>(SitesMethods.GetSingle + '/' + id);
  }

  updateSingleSite(model: SiteNameModel): Observable<OperationResult> {
    return this.post<SiteNameModel>(SitesMethods.UpdateSingle, model);
  }

  deleteSingleSite(id: number): Observable<OperationResult> {
    return this.get(SitesMethods.DeleteSingle + '/' + id);
  }
}
