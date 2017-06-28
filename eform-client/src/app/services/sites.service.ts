import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {OperationDataResult, OperationResult, SitesMethods} from '../modules/helpers/helpers.module';
import {BaseService} from './base.service';
import {SiteNameDto} from '../models/dto/site-name.dto';
import {SiteNameModel} from '../models/advanced/site-name.model';
@Injectable()
export class SitesService extends BaseService {


  private headers: Headers;

  constructor(private _http: Http) {
    super(_http);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  public getAllSites = (): Observable<OperationDataResult<Array<SiteNameDto>>> => {
    return this.getWithOperationDataResult<Array<SiteNameDto>>(SitesMethods.GetAll);
  }

  public getSingleSite = (id: number): Observable<OperationDataResult<SiteNameDto>> => {
    return this.getWithOperationDataResult<SiteNameDto>(SitesMethods.GetSingle + '/' + id);
  }

  public updateSingleSite = (model: SiteNameModel): Observable<OperationResult> => {
    return this.postModelOperationResult<SiteNameModel>(SitesMethods.UpdateSingle, model);
  }

  public deleteSingleSite = (id: number): Observable<OperationResult> => {
    return this.getWithOperationResult(SitesMethods.DeleteSingle + '/' + id);
  }
}
