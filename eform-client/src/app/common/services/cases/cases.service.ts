import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {
  CaseListModel,
  CasesRequestModel,
  OperationDataResult,
  OperationResult,
  ReplyElement,
  ReplyRequest
} from 'src/app/common/models';
import {BaseService} from 'src/app/common/services/base.service';

const CasesMethods = {
  EditById: '/api/cases/edit',
  GetCases: '/api/cases/index',
  UpdateCase: '/api/cases/update',
  DeleteCase: '/api/cases/delete'
};

@Injectable()
export class CasesService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getById(id: number): Observable<OperationDataResult<ReplyElement>> {
    return this.get<ReplyElement>(CasesMethods.EditById + '/' + id);
  }

  getCases(model: CasesRequestModel): Observable<OperationDataResult<CaseListModel>> {
    return this.post(CasesMethods.GetCases, model);
  }

  updateCase(model: ReplyRequest): Observable<OperationResult> {
    return this.post<ReplyRequest>(CasesMethods.UpdateCase, model);
  }

  deleteCase(id: number): Observable<OperationResult> {
    return this.get(CasesMethods.DeleteCase + '/' + id);
  }
}
