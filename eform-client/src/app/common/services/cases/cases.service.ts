import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CaseListModel,
  CasesRequestModel,
  OperationDataResult,
  OperationResult,
  ReplyElementDto,
  ReplyRequest,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

const CasesMethods = {
  EditById: '/api/cases/getcase',
  GetCases: '/api/cases/index',
  UpdateCase: '/api/cases/update',
  DeleteCase: '/api/cases/delete',
};

@Injectable()
export class CasesService {
  constructor(private apiBaseService: ApiBaseService) {}

  getById(
    id: number,
    templateId: number
  ): Observable<OperationDataResult<ReplyElementDto>> {
    return this.apiBaseService.get<ReplyElementDto>(
      CasesMethods.EditById + '?id=' + id + '&templateId=' + templateId
    );
  }

  getCases(
    model: CasesRequestModel
  ): Observable<OperationDataResult<CaseListModel>> {
    return this.apiBaseService.post(CasesMethods.GetCases, model);
  }

  updateCase(
    model: ReplyRequest,
    templateId: number
  ): Observable<OperationResult> {
    return this.apiBaseService.post<ReplyRequest>(
      CasesMethods.UpdateCase + '/' + templateId,
      model
    );
  }

  deleteCase(id: number, templateId: number): Observable<OperationResult> {
    return this.apiBaseService.get(
      CasesMethods.DeleteCase + '?id=' + id + '&templateId=' + templateId
    );
  }
}
