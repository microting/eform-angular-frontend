import { Injectable, inject } from '@angular/core';
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
  GetCases: '/api/cases',
  ArchiveCase: '/api/cases/archive',
  UnarchiveCase: '/api/cases/unarchive',
};

@Injectable()
export class CasesService {
  private apiBaseService = inject(ApiBaseService);


  getById(
    id: number,
    templateId: number
  ): Observable<OperationDataResult<ReplyElementDto>> {
    return this.apiBaseService.get<ReplyElementDto>(CasesMethods.GetCases, {
      id: id,
      templateId: templateId,
    });
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
    return this.apiBaseService.put<ReplyRequest>(
      CasesMethods.GetCases + '/' + templateId,
      model
    );
  }

  deleteCase(id: number, templateId: number): Observable<OperationResult> {
    return this.apiBaseService.delete(CasesMethods.GetCases, {
      id: id,
      templateId: templateId,
    });
  }

  archiveCase(caseId: number): Observable<OperationResult> {
    return this.apiBaseService.put(CasesMethods.ArchiveCase, caseId);
  }

  unArchiveCase(caseId: number): Observable<OperationResult> {
    return this.apiBaseService.put(CasesMethods.UnarchiveCase, caseId);
  }
}
