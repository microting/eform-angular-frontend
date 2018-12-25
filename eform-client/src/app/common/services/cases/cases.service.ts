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
  ReplyElementDto,
  ReplyRequest
} from 'src/app/common/models';
import {BaseService} from 'src/app/common/services/base.service';

const CasesMethods = {
  EditById: '/api/cases/getcase',
  GetCases: '/api/cases/index',
  UpdateCase: '/api/cases/update',
  DeleteCase: '/api/cases/delete'
};

@Injectable()
export class CasesService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getById(id: number, templateId: number): Observable<OperationDataResult<ReplyElementDto>> {
    return this.get<ReplyElementDto>(CasesMethods.EditById + '?id=' + id + '&templateId=' + templateId);
  }

  getCases(model: CasesRequestModel): Observable<OperationDataResult<CaseListModel>> {
    return this.post(CasesMethods.GetCases, model);
  }

  updateCase(model: ReplyRequest, templateId: number): Observable<OperationResult> {
    return this.post<ReplyRequest>(CasesMethods.UpdateCase + '/' + templateId, model);
  }

  deleteCase(id: number, templateId: number): Observable<OperationResult> {
    return this.get(CasesMethods.DeleteCase + '?id=' + id + '&templateId=' + templateId);
  }
}
