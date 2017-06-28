import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {OperationDataResult, UnitsMethods} from '../modules/helpers/helpers.module';
import {BaseService} from './base.service';
import {UnitDto} from '../models/dto/unit.dto';
@Injectable()
export class UnitsService extends BaseService {


  private headers: Headers;
  private currentUser: any;

  constructor(private _http: Http) {
    super(_http);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  public getAllUnits = (): Observable<OperationDataResult<Array<UnitDto>>> => {
    return this.getWithOperationDataResult<Array<UnitDto>>(UnitsMethods.GetAll);
  }
  public requestOtp = (id: number): Observable<OperationDataResult<UnitDto>> => {
    return this.getWithOperationDataResult<UnitDto>(UnitsMethods.RequestOtp + '/' + id.toString());
  }

  // public addNewSitePage = (model: SitePage): Observable<OperationDataResult<SitePage>> => {
  //     return this.postModelOperationDataResult<SitePage,SitePage>(WebSiteMethods.AddNewSitePage,model);
  // }

  // public getSitePageByAlias = (pageAlias: string): Observable<OperationDataResult<SitePage>> => {
  //     return this.getWithOperationDataResult<SitePage>(WebSiteMethods.GetSitePageByPageAlias + "/" + pageAlias);
  // }

  // public updateSitePage = (model: SitePage): Observable<OperationResult> => {
  //     return this.postModelOperationResult<SitePage>(WebSiteMethods.UpdateSitePage, model);
  // }
}
