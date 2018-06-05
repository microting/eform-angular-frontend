import {BaseService} from '../base.service';
import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';

import {OperationDataResult, OperationResult} from '../../modules/helpers/helpers.module';
import {ReplyElement, ReplyRequest, CaseListModel, CasesRequestModel} from 'app/models';

import {CasesMethods} from 'app/modules/helpers/app.constants';

@Injectable()
export class CasesService extends BaseService {
  private headers: Headers;

  constructor(private _http: Http, router: Router) {
    super(_http, router);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  getById(id: number): Observable<OperationDataResult<ReplyElement>> {
    return this.getWithOperationDataResult<ReplyElement>(CasesMethods.EditById + '/' + id);
  }

  getCases(model: CasesRequestModel): Observable<OperationDataResult<CaseListModel>> {
    return this.postModelOperationResult(CasesMethods.GetCases, model);
  }

  updateCase(model: ReplyRequest): Observable<OperationResult> {
    return this.postModelOperationResult<ReplyRequest>(CasesMethods.UpdateCase, model);
  }

  deleteCase(id: number): Observable<OperationResult> {
    return this.getWithOperationResult(CasesMethods.DeleteCase + '/' + id);
  }
}
