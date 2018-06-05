import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';

import {OperationDataResult, OperationResult, SitesMethods} from '../modules/helpers/helpers.module';
import {BaseService} from './base.service';
import {SiteNameModel, SiteNameDto} from 'app/models';


@Injectable()
export class SitesService extends BaseService {
  private headers: Headers;

  constructor(private _http: Http, router: Router) {
    super(_http, router);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  getAllSites(): Observable<OperationDataResult<Array<SiteNameDto>>> {
    return this.getWithOperationDataResult<Array<SiteNameDto>>(SitesMethods.GetAll);
  }

  getSingleSite(id: number): Observable<OperationDataResult<SiteNameDto>> {
    return this.getWithOperationDataResult<SiteNameDto>(SitesMethods.GetSingle + '/' + id);
  }

  updateSingleSite(model: SiteNameModel): Observable<OperationResult> {
    return this.postModelOperationResult<SiteNameModel>(SitesMethods.UpdateSingle, model);
  }

  deleteSingleSite(id: number): Observable<OperationResult> {
    return this.getWithOperationResult(SitesMethods.DeleteSingle + '/' + id);
  }
}
