import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';
import {
  OperationDataResult,
  OperationResult,
  EformDocxReportGenerateModel,
  EformDocxReportModel,
  EformDocxReportHeadersModel,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

export let EformDocxReportServiceMethods = {
  DocxReport: '/api/templates/docx-report',
  DocxReportHeaders: '/api/templates/docx-report/headers',
};

@Injectable()
export class EformDocxReportService {
  private apiBaseService = inject(ApiBaseService);


  getTemplateDocxReportHeaders(
    templateId: number
  ): Observable<OperationDataResult<EformDocxReportHeadersModel>> {
    return this.apiBaseService.get(
      EformDocxReportServiceMethods.DocxReportHeaders + '/' + templateId
    );
  }

  updateTemplateDocxReportHeaders(
    model: EformDocxReportHeadersModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post(
      EformDocxReportServiceMethods.DocxReportHeaders,
      model
    );
  }

  generateReport(
    model: EformDocxReportGenerateModel
  ): Observable<OperationDataResult<EformDocxReportModel>> {
    return this.apiBaseService.post(
      EformDocxReportServiceMethods.DocxReport,
      model
    );
  }

  downloadReport(model: EformDocxReportGenerateModel): Observable<string | Blob> {
    return this.apiBaseService.getBlobData<string | Blob>(
      EformDocxReportServiceMethods.DocxReport + '/word',
      model
    );
  }
}
