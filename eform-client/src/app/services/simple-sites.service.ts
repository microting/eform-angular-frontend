import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';

import {OperationDataResult, OperationResult} from '../modules/helpers/helpers.module';
import {BaseService} from './base.service';
import {SimpleSitesMethods} from '../modules/helpers/app.constants';
import {SimpleSiteModel, SiteDto} from 'app/models';

@Injectable()
export class SimpleSitesService extends BaseService {
  private headers: Headers;

  constructor(private _http: Http, router: Router) {
    super(_http, router);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  getAllSimpleSites(): Observable<OperationDataResult<Array<SiteDto>>> {
    return this.getWithOperationDataResult<Array<SiteDto>>(SimpleSitesMethods.GetAll);
  }

  getSingleSimpleSite(id: number): Observable<OperationDataResult<SiteDto>> {
    return this.getWithOperationDataResult<SiteDto>(SimpleSitesMethods.GetSingle + '/' + id);
  }

  updateSingleSimpleSite(model: SimpleSiteModel): Observable<OperationResult> {
    return this.postModelOperationResult<SimpleSiteModel>(SimpleSitesMethods.UpdateSingle, model);
  }

  deleteSingleSimpleSite(id: number): Observable<OperationResult> {
    return this.getWithOperationResult(SimpleSitesMethods.DeleteSingle + '/' + id);
  }

  createSingleSimpleSite(model: SimpleSiteModel): Observable<OperationResult> {
    return this.postModelOperationResult<SimpleSiteModel>(SimpleSitesMethods.CreateSingle, model);
  }
}

